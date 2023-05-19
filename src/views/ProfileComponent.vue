<template>
  <div class="max-w-[1400px] m-auto mt-0 p-4">
    <h2 class="text-[30px] text-white">Your Profile</h2>
    <div
      @mouseover="isImageChoosable = true"
      @mouseleave="isImageChoosable = false"
      class="max-w-[200px] h-[200px] mb-[50px] mt-[50px] relative"
    >
      <img
        width="200"
        v-if="!userDataStore.getUserProfileAvatar"
        src="../assets/user.png"
        alt=""
      />
      <img
        v-else
        class="rounded-[50%] transition-all ease-in-out delay-50 h-[200px] border border-red-100 object-cover"
        :class="{ 'blur-[2px]': isImageChoosable }"
        :src="userDataStore.getUserProfileAvatar"
        width="200"
        alt=""
      />
      <div>
        <label
          for="files"
          :class="{ unlockChoose: isImageChoosable }"
          class="text-white text-[20px] w-full text-center cursor-pointer invisible opacity-0 transition-all ease-linear delay-50"
        >
          <!-- Change Image -->
          <img
            class="max-w-[60px] absolute top-[40%] left-[50%] translate-x-[-50%]"
            src="../assets/photo-edit-icon.png"
            alt="Change Image"
            title="Change Image"
          />
        </label>
        <input id="files" class="hidden" type="file" @change="uploadImage" />
      </div>
    </div>
    <div class="text-[30px] text-white">
      <div>
        <h3>Your email: {{ getCurrentEmail }}</h3>
        <h3 v-if="userDataStore.getUserProfileName">
          Your name: {{ userDataStore.getUserProfileName }}
        </h3>
        <!-- ??? -->
        <div>
          <el-button
            type="success"
            @click="isChangeNameActive = !isChangeNameActive"
          >
            Change name
          </el-button>
          <div v-show="isChangeNameActive">
            <el-input
              class="max-w-[300px]"
              v-model="userName"
              placeholder="Your new name"
              @keyup.enter="setUserName"
            />
            <div>
              <el-button @click="setUserName">Set Name</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { ElButton } from "element-plus";
import { useToast } from "vue-toastification";
import { toastOptions } from "../toast/toastOptions";
import { useUserDataStore } from "../stores/userData";
import { useGamesStoreBasket } from "../stores/gamesBasket";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
const userDataStore = useUserDataStore();
const gamesBasket = useGamesStoreBasket();
const toast = useToast();

const userName = ref();
const displayName = ref();
const isChangeNameActive = ref(false);
const isImageChoosable = ref(false);
const uploadImage = (e: any) => {
  const storage = getStorage();
  if (e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0];
    const avatarRef = storageRef(storage, "avatars/" + file.name);

    uploadBytes(avatarRef, file).then((snapshot) => {
      console.log("Uploaded a blob or file!", snapshot);
    });

    const uploadTask = uploadBytesResumable(avatarRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        toast.error("Error: " + error, toastOptions);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUserAvatar(downloadURL);
          console.log("NEW File available at", downloadURL);
        });
      }
    );
  }
};
const auth = getAuth();
const user = auth.currentUser;
const setUserName = () => {
  if (user) {
    updateProfile(user, {
      displayName: userName.value,
    })
      .then(() => {
        toast.success(
          "You succesfully changed your name to: " + userName.value,
          toastOptions
        );
        displayName.value = user.displayName;
        userDataStore.setUserProfileName(displayName.value);
        isChangeNameActive.value = false;
        updateUserInfoInCollection();
        if (user.photoURL) {
          userDataStore.setUserProfileAvatar(user.photoURL);
        }
      })
      .catch((error) => {
        toast.error("Error: " + error, toastOptions);
      });
  }
};

const setUserAvatar = (url: string) => {
  if (user) {
    updateProfile(user, {
      photoURL: url,
    })
      .then(() => {
        toast.success("Your image was successfully loaded", toastOptions);
        if (user.photoURL) {
          userDataStore.setUserProfileAvatar(user.photoURL);
        }
        updateUserInfoInCollection();
      })
      .catch((error) => {
        toast.error("Error: " + error, toastOptions);
      });
  }
};
const loadUserData = (name: string, image: string) => {
  userDataStore.setUserProfileName(name);
  userDataStore.setUserProfileAvatar(image);
};

const getCurrentEmail = computed(() => {
  if (auth.currentUser) {
    return auth.currentUser.email;
  }
});

const updateUserInfoInCollection = async () => {
  const usersRef = collection(db, "users");
  await updateDoc(doc(usersRef, userDataStore.getUserProfileEmail), {
    userDisplayName: userDataStore.getUserProfileName,
    userEmail: userDataStore.getUserProfileEmail,
    userAvatar: userDataStore.getUserProfileAvatar,
  });
};

onMounted(async () => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is logged in
      console.log("User is logged in", user);
      if (user.displayName && user.photoURL) {
        loadUserData(user?.displayName, user?.photoURL);
      }
    } else {
      // User is logged out
      console.log("User is logged out");
    }
  });

  // To stop listening to the authentication state changes, call the unsubscribe function
  unsubscribe();
});
</script>

<style scoped>
.unlockChoose {
  visibility: visible;
  opacity: 1;
}
</style>
