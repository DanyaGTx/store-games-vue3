<template>
  <div
    class="max-w-[500px] bg-[#202020] min-h-[80vh] rounded-sm m-auto p-[20px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%]"
  >
    <div class="w-full mt-8">
      <div class="flex justify-center">
        <img class="w-[50px] h-[50px]" src="../assets/logo.png" alt="logo" />
      </div>
      <el-form
        ref="ruleFormRef"
        :model="login"
        :rules="rules"
        class="max-w-[400px] m-auto mt-[50px] w-full"
        status-icon
      >
        <el-form-item class="!mb-7" prop="email">
          <el-input
            placeholder="Email"
            class="h-[60px]"
            type="email"
            v-model="login.email"
          />
        </el-form-item>

        <el-form-item size="large" prop="password">
          <el-input
            class="h-[60px]"
            placeholder="Password"
            type="password"
            v-model="login.password"
          />
        </el-form-item>

        <div>
          <el-form-item v-if="!createNewAccount" class="mt-3">
            <el-button
              class="w-full !h-[60px] !font-bold tracking-wider"
              type="primary"
              @click="signIn(ruleFormRef)"
            >
              LOGIN
            </el-button>
          </el-form-item>
          <el-form-item v-else class="mt-3">
            <el-button
              class="w-full !h-[60px] !font-bold tracking-wider"
              type="primary"
              size="large"
              @click="signUp(ruleFormRef)"
            >
              CREATE ACCOUNT
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="createNewAccount"
              label="Don't have an account?"
              size="large"
            />
          </el-form-item>
          <el-form-item>
            <div class="login-with">
              <p class="w-full text-center text-[#FFFFFFB8] min-w-fit">
                or continue with
              </p>
            </div>
          </el-form-item>
          <el-form-item>
            <div
              @click="signInWithGoogle"
              class="h-[64px] rounded-md bg-white flex justify-center items-center w-[80px] m-auto cursor-pointer select-none"
            >
              <img
                class="w-[28px]"
                src="../assets/google-icon.svg"
                alt="Login with Google"
              />
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "vue-toastification";
import { ElForm, ElInput, ElButton, ElFormItem } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "@firebase/firestore";
import createUserCollection from "../firebase/database/createUserCollection";
import { db } from "../firebase/firebase";
import router from "../router/router";
import { toastOptions } from "../toast/toastOptions";
import { useUserDataStore } from "../stores/userData";
import { LOGIN } from "../intrerfaces/types";

const userDataStore = useUserDataStore();
const ruleFormRef = ref<FormInstance>();

const toast = useToast();

const login = ref<LOGIN>({
  email: "",
  password: "",
});

const createNewAccount = ref(false);

const rules = ref<FormRules>({
  email: [
    {
      required: true,
      message: "Please input email address",
      trigger: "blur",
    },
    {
      type: "email",
      message: "Please input correct email address",
      trigger: ["blur", "change"],
    },
  ],
  password: [
    { required: true, message: "Please input password", trigger: "blur" },
    {
      min: 6,
      message: "Length should be from 6 characters",
      trigger: "blur",
    },
  ],
});

const signIn = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, login.value.email, login.value.password)
        .then((data) => {
          toast.success("You are logged in", toastOptions);
          router.push({ name: "store" });
        })
        .catch((error) => {
          toast.error("Error: " + error, toastOptions);
        });
    } else {
      console.log("error submit!", fields);
    }
  });
};

const signUp = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const auth = getAuth();
      createUserWithEmailAndPassword(
        auth,
        login.value.email,
        login.value.password
      )
        .then((data) => {
          toast.success("Your account has been registered", toastOptions);
          createUserCollection();
          router.push({ name: "store" });
        })
        .catch((error) => {
          toast.error("Error: " + error, toastOptions);
        });
    } else {
      console.log("error submit!", fields);
    }
  });
};

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(getAuth(), provider)
    .then(async (result) => {
      console.log(result.user);

      const docRef = doc(db, "users", userDataStore.getUserProfileEmail);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        createUserCollection();
      }

      router.push({ name: "store" });
    })
    .catch((error) => {
      if (error.message !== "Firebase: Error (auth/popup-closed-by-user).") {
        toast.error("Error: " + error, toastOptions);
      }
    });
};
</script>

<style lang="scss" scoped>
.login-with {
  display: flex;
  align-items: center;
  text-align: center;
  width: 100%;
  &::before {
    content: "";
    display: block;
    width: 100%;
    align-self: center;
    border-top: 1px solid rgba(255, 255, 255, 0.16);
  }
  &::after {
    content: "";
    display: block;
    width: 100%;
    align-self: center;
    border-top: 1px solid rgba(255, 255, 255, 0.16);
  }
}

.responsive .el-form-item__content {
  margin-left: 0 !important;
}
</style>
