<template>
  <div
    class="flex justify-center items-center h-[500px] max-w-[500px] bg-[#ffffff] mt-[100px] rounded-2xl relative m-auto p-[20px]"
  >
    <div
      class="max-[420px]:text-[25px] text-[30px] text-center absolute top-[10%] left-[50%] translate-x-[-50%]"
    >
      Login
    </div>
    <el-form
      ref="ruleFormRef"
      :model="login"
      :rules="rules"
      class="max-w-[400px] mt-[50px] w-full"
      label-width="50px"
      status-icon
    >
      <el-form-item label="Email" class="pl-[20px]" prop="email">
        <el-input type="email" v-model="login.email" />
      </el-form-item>

      <el-form-item label="Password" class="pl-[20px]" prop="password">
        <el-input type="password" v-model="login.password" />
      </el-form-item>

      <div class="ml-[20px]">
        <el-form-item class="mt-[30px]">
          <el-button type="primary" @click="signIn(ruleFormRef)">
            Login
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
        </el-form-item>
        <el-form-item>
          <h3
            class="mt-[-10px] text-[13px] text-right cursor-pointer text-blue-900"
            @click="signInWithGoogle"
          >
            Login with Google
          </h3>
        </el-form-item>
        <el-form-item>
          <h3
            @click="$router.push({ name: 'register' })"
            class="mt-[-10px] text-[13px] text-right cursor-pointer text-blue-900"
          >
            Dont not have an account?
          </h3>
        </el-form-item>
      </div>
    </el-form>
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
          console.log(data);
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
      toast.error("Error: " + error, toastOptions);
    });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style lang="scss" scoped></style>
