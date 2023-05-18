<template>
  <div
    class="flex justify-center items-center h-[500px] max-w-[500px] bg-[#ffffff] mt-[100px] rounded-2xl relative m-auto p-[20px]"
  >
    <div
      class="max-[420px]:text-[20px] text-[30px] text-center absolute top-[10%] left-[50%] translate-x-[-50%]"
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
      <el-form-item label="Email" class="pl-[20px]" prop="email">
        <el-input type="email" v-model="register.email" />
      </el-form-item>
      <el-form-item label="Password" class="pl-[20px]" prop="password">
        <el-input type="password" v-model="register.password" />
      </el-form-item>

      <div class="ml-[20px]">
        <el-form-item>
          <el-button type="primary" @click="signUp(ruleFormRef)">
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
  updateProfile,
} from "firebase/auth";

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useUserDataStore } from "../stores/userData";

import { useToast } from "vue-toastification";

import { toastOptions } from "../toast/toastOptions";

import router from "../router/router";

import userFields from "../constants/userFields";
const ruleFormRef = ref<FormInstance>();

const toast = useToast();

const userDataStore = useUserDataStore();

interface Register {
  email: string;
  password: string;
}

const register = ref<Register>({
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

const createUserCollection = async () => {
  const usersRef = collection(db, "users");
  await setDoc(
    doc(usersRef, userDataStore.getUserProfileEmail),
    userFields.setup().userFields
  );
};

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(getAuth(), provider)
    .then((result) => {
      console.log(result.user);
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
