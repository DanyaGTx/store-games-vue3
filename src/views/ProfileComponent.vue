<template>
  <div class="max-w-[1400px] m-auto mt-0 p-4">
    <div class="text-[30px] text-white">
      <el-button @click="$router.go(-1)" class="mb-[20px]">Back</el-button>
      <h2>Profile</h2>
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
          <!-- <div>
            <el-button @click="loadUserInCollection">Load User</el-button>
          </div> -->
        </div>
      </div>
    </div>

    <div class="mt-[50px]">
      <img
        width="200"
        v-if="!userDataStore.getUserProfileAvatar"
        src="../assets/user.png"
        alt=""
      />
      <img
        v-else
        :src="userDataStore.getUserProfileAvatar"
        width="200"
        alt=""
      />
      <input type="file" @change="uploadImage" />
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
import { collection, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
const userDataStore = useUserDataStore();
const gamesBasket = useGamesStoreBasket();
const toast = useToast();

const userName = ref();
const displayName = ref();
const isChangeNameActive = ref(false);

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

  await setDoc(doc(usersRef, userDataStore.getUserProfileEmail), {
    userDisplayName: userDataStore.getUserProfileName,
    userEmail: userDataStore.getUserProfileEmail,
    userAvatar: userDataStore.getUserProfileAvatar,
    gamesInCart: gamesBasket.getAllGamesInCart,
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

<style scoped></style>
