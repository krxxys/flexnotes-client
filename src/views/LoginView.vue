<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../http'
import { useToast } from 'primevue'
import * as yup from "yup";
import { useForm } from 'vee-validate'
import { login } from '../auth';
import { Form } from 'vee-validate';
const router = useRouter();
const toast = useToast();

const schema = yup.object().shape({
  username: yup.string().required("Username is required").min(5, "Minimum username lenght is 5 characters"),
  password: yup.string().required("Username is required").min(7, "Minimum password lenght is 7 characters"),
  remember_me: yup.bool()
})

const { meta, defineField, handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
})

const [username, username_atrs] = defineField('username');
const [password, password_atrs] = defineField('password');
const [remember_me, remember_me_atrs] = defineField('remember_me');

const onSubmit = handleSubmit(async (values) => {
  console.log("ESSA")
  const result = await login(values);
  if (result.status == true) {
    localStorage.setItem('access_token', result.access_token);
    localStorage.setItem('refresh_token', result.refresh_token);
    localStorage.setItem('username', result.username);
    toast.add({
      severity: 'success',
      summary: 'Login',
      detail: result.message,
      life: 3000,
    })
    router.push('/')
  } else if (result.status == false) {
    toast.add({
      severity: 'error',
      summary: 'Login error',
      detail: result.message,
      life: 3000,
    });
  } else {
    toast.add({
      severity: 'error',
      summary: 'Login error',
      detail: result.message,
      life: 3000,
    });
  }

})
</script>

<template>
  <div class="bg-surface-50 dark:bg-surface-800 px-6 py-20 md:px-12 h-screen lg:px-20">
    <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-border w-full lg:w-6/12 mx-auto">
      <div class="text-center mb-8">
        <svg class="mb-4 mx-auto fill-surface-600 dark:fill-surface-200 h-16" viewBox="0 0 30 32" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M20.7207 6.18211L14.9944 3.11148L3.46855 9.28678L0.579749 7.73444L14.9944 0L23.6242 4.62977L20.7207 6.18211ZM14.9996 12.3574L26.5182 6.1821L29.4216 7.73443L14.9996 15.4621L6.37724 10.8391L9.27337 9.28677L14.9996 12.3574ZM2.89613 16.572L0 15.0196V24.2656L14.4147 32V28.8953L2.89613 22.7132V16.572ZM11.5185 18.09L0 11.9147V8.81001L14.4147 16.5376V25.7904L11.5185 24.2312V18.09ZM24.2086 15.0194V11.9147L15.5788 16.5377V31.9998L18.475 30.4474V18.09L24.2086 15.0194ZM27.0969 22.7129V10.3623L30.0004 8.81V24.2653L21.3706 28.895V25.7904L27.0969 22.7129Z" />
        </svg>

        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">
          Welcome Back
        </div>
        <span class="text-surface-600 dark:text-surface-200 font-medium leading-normal">
          Don't have an account?
        </span>
        <a class="font-medium no-underline ml-2 text-primary cursor-pointer"
          @click="router.push({ path: '/register' })">Create today!</a>
      </div>

      <Form :onSubmit="onSubmit">
        <div class="mb-4">
          <label for="username" class="text-surface-900 dark:text-surface-0 font-medium mb-2 block">
            Username
          </label>
          <InputText name="username" id="username" v-model="username" type="text" placeholder="Username" class="w-full"
            :class="{ 'p-invalid': errors.username }" />
          <small class="p-error">{{ errors.username }}</small>
        </div>
        <div class="mb-4">
          <label for="password" class="text-surface-900 dark:text-surface-0 font-medium mb-2 block">
            Password
          </label>

          <InputText name="password" type="password" v-model="password" placeholder="Password" class="w-full"
            :class="{ 'p-invalid': errors.password }" />

          <small class="p-error">{{ errors.password }}</small>
        </div>

        <div class="mb-4">
          <label for="remember_me" class="text-surface-900 dark:text-surface-0 font-medium mb-2 block">
            Remember the password
            <Checkbox name="remember_me" v-model="remember_me" binary />
          </label>
        </div>
        <Button type="submit" label="Login" />
      </Form>
    </div>
  </div>
</template>
