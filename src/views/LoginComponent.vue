<template>
  <div
    class="flex justify-center items-center h-[500px] max-w-[500px] bg-[#ffffff] mt-[100px] m-auto rounded-2xl"
  >
    <el-form
      ref="ruleFormRef"
      :model="login"
      :rules="rules"
      label-width="120px"
      class="mr-[70px] w-full"
      status-icon
    >
      <el-form-item label="Email" prop="email">
        <el-input type="email" v-model="login.email" />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input type="password" v-model="login.password" />
      </el-form-item>
      <el-form-item>
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
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElForm, ElInput, ElButton, ElFormItem } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { toastOptions } from "../toast/toastOptions";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useToast } from "vue-toastification";
import router from "../router/router";
const ruleFormRef = ref<FormInstance>();

const toast = useToast();
interface Login {
  email: string;
  password: string;
}

const login = ref<Login>({
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

<style lang="scss" scoped></style>
