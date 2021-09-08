import React, {useContext, useState, useEffect } from 'react'
import { auth, emailAuthProvider } from '../firebase'


const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    function signup(username, email, password) {
        return auth.createUserWithEmailAndPassword(email, password).then(credential => {
        
            // console.log(credential.user);
    
            credential.user.updateProfile({
                displayName: username
                // , photoURL: "https://example.com/jane-q-user/profile.jpg" <= Not Implemented yet
            });
    
            auth.currentUser.sendEmailVerification()
            .then(() => {
                // Email verification sent!
                console.log('Email verification sent!');
            });
    
        });
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password).then(credential => {
            console.log(credential.user);
            // console.log(credential.user.displayName === null);
        });
    }

    function logout() {
        return auth.signOut();
    }

    function requestNewPassword(email) {
        if(email === 'forRestoredEmail') {
            email = restoreEmailId
        }
        return auth.sendPasswordResetEmail(email).then(() => {
            // Password reset email sent!
            console.log('Password reset email sent');
        }).catch((error) => {
              // Example 1: auth/user-not-found
              // Example 2: auth/too-many-requests
              var errorCode = error.code;
              console.log(errorCode);
      
              // Example 1: There is no user record corresponding to this identifier. The user may have been deleted.
              // Example 2: We have blocked all requests from this device due to unusual activity. Try again later.
              var errorMessage = error.message;
              console.log(errorMessage);
        });
    }

    function reauthenticateUser(currentPassword) {
        const credential = emailAuthProvider.credential(currentUser.email, currentPassword)
        return currentUser.reauthenticateWithCredential(credential)
    }

    function updateEmail(newEmail) {
        /*
            PreCondition: reauthenticateUser(currentPassword) function returned fulfilled promise state

            currentUser's email could be directly updated by using:
            currentUser.updateEmail(newEmail) method function
            
            BUT Here, we are first sending verification email to `newEmail` 
            and then updateEmail method is called in ../account/actions
        */
        return auth.currentUser.verifyBeforeUpdateEmail(newEmail)                     
    }
    
    function updatePassword(newPassword) {
        /* 
            PreCondition: reauthenticateUser(currentPassword) function returned fulfilled promise state 
        */
        return currentUser.updatePassword(newPassword)        
    }

    function verifyEmail(oobCode) {
        return auth.applyActionCode(oobCode)
    }

    function verifyPasswordResetCode(oobCode) {
        return auth.verifyPasswordResetCode(oobCode)
    }

    function resetPassword(oobCode, newPassword) {
        return auth.confirmPasswordReset(oobCode, newPassword)
    }

    var restoreEmailId = null
    function verifyEmailRecoveryCode(oobCode) {
        // Confirm the action code is valid.
        return auth.checkActionCode(oobCode).then((info) => {
            restoreEmailId = info['data']['email']
        })
    }

    function recoverEmail(oobCode) {
        // Revert to the old email
        return auth.applyActionCode(oobCode);
    }

    const logUserCredentials = () => {
        auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })
    } 

    useEffect(() => {
        const unsubscribe = logUserCredentials()
        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const value = {
        currentUser,
        signup,
        login,
        logout,
        requestNewPassword,
        updateEmail,
        updatePassword,
        reauthenticateUser,
        verifyEmail,
        verifyPasswordResetCode,
        resetPassword,
        verifyEmailRecoveryCode,
        recoverEmail
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}