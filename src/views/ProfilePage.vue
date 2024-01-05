<template>
  <div class="py-5">
    <h2 class="text-[30px] text-white">Your Profile</h2>
    <div class="flex justify-between mt-[50px] mb-[50px]">
      <div
        class="flex items-center gap-16 max-[640px]:gap-10 max-[560px]:block"
      >
        <div
          @mouseover="isImageChoosable = true"
          @mouseleave="isImageChoosable = false"
          class="min-w-[200px] h-[200px] relative"
        >
          <img
            width="200"
            v-if="!userDataStore.getUserProfileAvatar"
            src="../assets/user.png"
            alt="avatar"
          />
          <div v-else :class="imageClass" class="fade-in-image">
            <img
              @load="imageLoading(userDataStore.getUserProfileAvatar)"
              class="rounded-[50%] transition-all ease-in-out delay-50 border-4 border-red-100 object-cover"
              :class="{ 'blur-[2px]': isImageChoosable }"
              :src="userDataStore.getUserProfileAvatar"
              width="200"
              alt="avatar"
            />
          </div>

          <div>
            <label
              for="files"
              :class="{ unlockChoose: isImageChoosable }"
              class="text-white text-[20px] w-full text-center cursor-pointer invisible opacity-0 transition-all ease-linear delay-50"
            >
              <img
                class="max-w-[60px] absolute top-[40%] left-[50%] translate-x-[-50%]"
                src="../assets/photo-edit-icon.png"
                alt="Change Image"
                title="Change Image"
              />
            </label>
            <input
              id="files"
              class="hidden"
              type="file"
              @change="uploadImage"
            />
          </div>
        </div>
        <div class="flex justify-between w-full max-[560px]:mt-5">
          <div class="text-[30px] text-white max-[640px]:text-[20px]">
            <div>
              <div class="flex items-center">
                <h3 v-if="userDataStore.getUserProfileName">
                  <p class="text-6xl max-[640px]:text-[40px]">
                    {{ userDataStore.getUserProfileName }}
                  </p>
                  <p>{{ getCurrentEmail }}</p>
                </h3>
              </div>

              <h3>Favorite games: {{ getFavoriteGamesAmount }}</h3>
            </div>
          </div>
        </div>
      </div>
      <div class="relative">
        <div
          @click="handleProfileEditings"
          class="w-[50px] h-[50px] bg-[#606060] transition-colors hover:bg-[#848383] cursor-pointer flex justify-center items-center rounded-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-[20px]"
            viewBox="0 0 24 24"
            fill="white"
            aria-hidden="true"
            data-testid="MoreIcon"
            focusable="false"
          >
            <path
              d="M3 12a2 2 0 114 0 2 2 0 01-4 0zm7 0a2 2 0 114 0 2 2 0 01-4 0zm9-2a2 2 0 100 4 2 2 0 000-4z"
            ></path>
          </svg>
        </div>
        <div
          v-show="isProfileSettingsPopupVisible"
          class="w-[170px] min-h-[50px] bg-[#373737] absolute top-16 right-0"
          ref="profileSettingsPopup"
        >
          <ul class="text-white">
            <li
              @click="changeNamePrompt"
              class="text-center text-base p-2 my-2 transition-colors hover:bg-slate-400 cursor-pointer"
            >
              Edit Name
            </li>
            <li
              class="text-center p-2 my-2 transition-colors hover:bg-slate-400 cursor-pointer"
            >
              <label
                for="files"
                :class="{ unlockChoose: isImageChoosable }"
                class="text-white text-[20px] w-full text-center cursor-pointer transition-all ease-linear delay-50"
              >
                <p class="text-base">Upload Image</p>
              </label>
              <input
                id="files"
                class="hidden"
                type="file"
                @change="uploadImage"
              />
            </li>
          </ul>
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
import { ElMessageBox } from "element-plus";
import { useToast } from "vue-toastification";
import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useUserDataStore } from "../stores/userData";
import { useFavoriteGames } from "../stores/favoriteGames";
import { toastOptions } from "../toast/toastOptions";
import { onClickOutside } from "@vueuse/core";

const userDataStore = useUserDataStore();
const favoriteGames = useFavoriteGames();

const toast = useToast();

const displayName = ref();
const isChangeNameActive = ref(false);
const isImageChoosable = ref(false);
const isProfileSettingsPopupVisible = ref(false);
const profileSettingsPopup = ref(null);

const auth = getAuth();
const user = auth.currentUser;

const uploadImage = (e: any) => {
  const storage = getStorage();
  if (e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0];

    // Check the type of file
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed", toastOptions);
      return;
    }

    toast.info("Your avatar will be uploaded soon :)", toastOptions);

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

const setUserName = (newName: string) => {
  if (user) {
    updateProfile(user, {
      displayName: newName,
    })
      .then(() => {
        toast.success(
          "You succesfully changed your name to: " + newName,
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

const changeNamePrompt = () => {
  ElMessageBox.prompt("Please input your name", "Change name", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    inputPattern: /^[\p{L}\s'-]+$/u,
    inputErrorMessage: "Invalid name",
    inputValue: userDataStore.getUserProfileName,
  })
    .then(({ value }) => {
      setUserName(value);
    })
    .catch((e) => {
      console.log(e);
    });
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

const handleProfileEditings = () => {
  isProfileSettingsPopupVisible.value = !isProfileSettingsPopupVisible.value;
};

const getCurrentEmail = computed(() => {
  if (auth.currentUser) {
    return auth.currentUser.email;
  }
});

const imageClass = ref("fade-in-image");

const imageLoading = (img: string) => {
  const image = new Image();
  image.src = img;
  image.onload = () => {
    imageClass.value = "fade-in-image is-loaded";
  };
};

const updateUserInfoInCollection = async () => {
  const usersRef = collection(db, "users");
  await updateDoc(doc(usersRef, userDataStore.getUserProfileEmail), {
    userDisplayName: userDataStore.getUserProfileName,
    userEmail: userDataStore.getUserProfileEmail,
    userAvatar: userDataStore.getUserProfileAvatar,
  });
};

const getFavoriteGamesAmount = computed(() => {
  return favoriteGames.getFavoriteIds.length;
});

onClickOutside(profileSettingsPopup, (event) => {
  isProfileSettingsPopupVisible.value = false;
});

onMounted(async () => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      if (user.displayName && user.photoURL) {
        loadUserData(user?.displayName, user?.photoURL);
      }
    } else {
      console.log("User is logged out");
    }
  });

  unsubscribe();
});
</script>

<style scoped>
.unlockChoose {
  visibility: visible;
  opacity: 1;
}
</style>
