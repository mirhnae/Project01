import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getAuth, signOut,  signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"
import { getDatabase, ref, push, get, child, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = {
    apiKey: "AIzaSyCQczjbPlqWdbMW6mY0WqfYqMBm8XR47xM",
    authDomain: "realtime-database-a2172.firebaseapp.com",
    databaseURL: "https://realtime-database-a2172-default-rtdb.firebaseio.com/",
    projectId: "realtime-database-a2172",
    storageBucket: "realtime-database-a2172.appspot.com",
    messagingSenderId: "831194764980",
    appId: "1:831194764980:web:8c04c49ca1bb629f7da9e1"
}



const app = initializeApp(appSettings)
const database = getDatabase (app)
const shoppingListInDB = ref (database, "shoppingList")

console.log(app)
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("grocery-list")


addButtonEl.addEventListener("click", function () {
    let inputValue = inputFieldEl.value

    const key =  push (shoppingListInDB, inputValue).key

    console.log(key,inputValue)

    inputFieldEl.value = ""

    shoppingListEl.innerHTML += `<li id=${key}>${inputValue} &#215;</li>`

    location.reload()
})

setInterval(function(){
    const auth = getAuth(app)
    signOut(auth).then(()=> {
        localStorage.clear()
        alert("Signin out Automatically")
    })
},  100000)


window.onload = function(){
    let user = localStorage.getItem('user')
    const auth = getAuth(app)
    const provider = new GoogleAuthProvider()

    if (!user){
        signInWithPopup(auth,provider).then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            user = result.user;
            alert(`User : ${user?.displayName} has been Logged in`)
            localStorage.setItem('user', user)
            location.reload ()
        }).catch(() => {
            alert('Please Login')
        })
    }


    if(user){
        const app = initializeApp(appSettings)
        const database = getDatabase (app)
        const shoppingListInDB = ref (database)
        const shoppingListEl = document.getElementById("grocery-list")
        get(child(shoppingListInDB, '/shoppingList')).then(function(snapshot){
            if (!snapshot.exists()){
                alert("No Data Available in your Database")
            }

            let groceries = snapshot.val()
            Object.keys(snapshot.val()).forEach((grocery) => {
                shoppingListEl.innerHTML += `<li id=${grocery}>${groceries[grocery]}</li>`
            })
            let list = document.getElementsByTagName('li')
            for (let i = 0; i < list.length; i++) {
                list[i].addEventListener("click", function(event){
                    remove(child(shoppingListInDB, `shoppingList/${event.target.id}`)).then(function(){
                            alert(`Removed Grocery : ${event.target.innerHTML}`)
                            location.reload()
                    })
                });
            }
        })
    }
    // location.reload()
}