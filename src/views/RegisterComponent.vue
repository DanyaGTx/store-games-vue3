<template>
  <div class="m-[20px]">
    <div
      class="flex justify-center items-center h-[500px] max-w-[500px] bg-[#ffffff] mt-[100px] rounded-2xl relative m-auto p-[20px]"
    >
      <div
        class="text-[30px] text-center absolute top-[10%] left-[50%] translate-x-[-50%] min-w-[200px]"
      >
        Create account
      </div>
      <el-form
        ref="ruleFormRef"
        :model="register"
        :rules="rules"
        class="max-w-[400px] mt-[50px] w-full"
        label-width="50px"
        status-icon
      >
        <div class="flex flex-col">
          <div>
            <el-form-item label="Email" class="pl-[20px]" prop="email">
              <el-input type="email" v-model="register.email" />
            </el-form-item>
          </div>
          <div>
            <el-form-item label="Password" class="pl-[20px]" prop="password">
              <el-input type="password" v-model="register.password" />
            </el-form-item>
          </div>
        </div>

        <div class="ml-[20px] max-[360px]:flex max-[360px]:flex-col">
          <el-form-item>
            <el-button
              class="max-[360px]:mb-[10px]"
              type="primary"
              @click="signUp(ruleFormRef)"
            >
              Create account
            </el-button>
            <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
          </el-form-item>
          <el-form-item>
            <h3
              class="mt-[-10px] text-[13px] text-right cursor-pointer text-blue-900"
              @click="signInWithGoogle"
            >
              SignIn with Google
            </h3>
          </el-form-item>
          <el-form-item>
            <h3
              @click="$router.push({ name: 'login' })"
              class="mt-[-10px] text-[13px] text-right cursor-pointer text-blue-900"
            >
              I have an account
            </h3>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElForm, ElInput, ElButton, ElFormItem } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useToast } from "vue-toastification";
import { doc, getDoc } from "@firebase/firestore";
import router from "../router/router";
import createUserCollection from "../firebase/database/createUserCollection";
import { useUserDataStore } from "../stores/userData";
import { toastOptions } from "../toast/toastOptions";
import { db } from "../firebase/firebase";
import { REGISTER } from "../intrerfaces/types";
const userDataStore = useUserDataStore();
const ruleFormRef = ref<FormInstance>();

const toast = useToast();

const register = ref<REGISTER>({
  email: "",
  password: "",
});

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

const signUp = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const auth = getAuth();
      createUserWithEmailAndPassword(
        auth,
        register.value.email,
        register.value.password
      )
        .then((data) => {
          console.log(data);

          toast.success("account has been registered", toastOptions);
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
      const docRef = doc(db, "users", userDataStore.getUserProfileEmail);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        createUserCollection();
      }
      router.push({ name: "store" });
    })
    .catch((error) => {
      toast.error("Error: " + error, toastOptions);
    });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style></style>
