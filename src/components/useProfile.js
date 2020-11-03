/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

function onChangeAvatar(event) {
    if (event.target.files && event.target.files[0]) {
      // Check this file is an image?
      compressImage(event.target.files).then(({ photo, info }) => {
        
        const prefixFiletype = photo.type
        if (prefixFiletype.indexOf(APPSTRING.PREFIX_IMAGE) !== 0) {
          createToast('File not Image.', 'danger');
          return
        }
        newAvatar = photo.data
        console.log(URL.createObjectURL(photo.data));
        setPhotoUrl(URL.createObjectURL(photo.data));
      })
      
    } else {
      createToast('Something wrong with input file', 'danger');
    }
  };

  function uploadAvatar() {
    setLoading(true);
    if (newAvatar) {
      const uploadTask = firebase.storage
        .ref(APPSTRING.USER_PROFILE_IMAGE)
        .child(currentUser.id)
        .put(newAvatar);
      uploadTask.on(
        APPSTRING.UPLOAD_CHANGED,
        null,
        err => {
          createToast(err.message, 'danger');
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log(downloadURL);
            
            updateUserInfo(downloadURL, true);
          })
        }
      )
    } else {
      updateUserInfo();
    }
  };

  function updateUserInfo(downloadURL = null, isPhotoUrl = false) {
    let newInfo;
    if (isPhotoUrl) {
      newInfo = {
        nickname: name, email, phone , shop, photoUrl: downloadURL
      }
    } else {
      newInfo = { nickname: name, email, phone , shop, }
    }

    firebase.firestore.collection(APPSTRING.USERS)
      .doc(currentUser.id)
      .update(newInfo)
      .then(() => {
        // localStorage.setItem(APPSTRING.NICKNAME, nickname)
        // localStorage.setItem(APPSTRING.ABOUT_ME, aboutMe)
        if (isPhotoUrl) {
          // localStorage.setItem(APPSTRING.PHOTO_URL, downloadURL)
        }
        setLoading(false);
        createToast('Update info success');
      })
    
  }

