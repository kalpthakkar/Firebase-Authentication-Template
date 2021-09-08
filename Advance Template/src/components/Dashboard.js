import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

export default function Dashboard() {

    const [error, setError] = useState('')
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    async function handleLogout() {
        setError('')
        try {
            await logout()
            history.push('/login')
        } catch {
            setError('Failed to logout')
        }
    }

    /*  Incase if you want to perform emailVerification for users who are loggedIn via social links
        Note: 
                > user loggedIn via googleAuthProvider will be having emailVerified = true (by default)
                > while implementing so, there also rise a need to modify PrivateRoute.js 
                  & below condition to display HTML content in return block 
    */
    // if(!(currentUser.emailVerified))
    // {
    //     var authProvider = currentUser.providerData[0].providerId
    //     if(authProvider === "github.com" || authProvider === "facebook.com")
    //     {
    //         var accountCreatedAt = currentUser.multiFactor.user.metadata.createdAt
    //         var lastLoginAt = currentUser.multiFactor.user.metadata.lastLoginAt
    //         var timeThresholdInSeconds = 20 // sec

    //         if(Math.abs(accountCreatedAt - lastLoginAt) < timeThresholdInSeconds)
    //         {
    //             // New user logged in for the first time via social link
    //             // Optionally: we could send emailVerification link to user's emailId
    //             // EmailId: console.log(currentUser.email)
    //         }
    //     }
    // }

    return (
        <div>
            {JSON.stringify(currentUser) }
            <h2>Dashboard</h2>
            <span>
                <h3>Welcome {currentUser.displayName}!</h3>
            </span>

            <div>
                {(  (   (currentUser.emailVerified) || 
                        (currentUser.providerData[0].providerId === "github.com" || currentUser.providerData[0].providerId === "facebook.com")
                    ) 

                ? 
                
                <div>
                    <p>You are a verified user :) </p>
                    <Link to='/update-profile'>Update Profile</Link>
                    <br/>
                    {error && error}
                </div>
                
                : 
                
                <div>
                    <p>You are not verified :(</p>
                    <p>Please check your inbox!</p>
                    <p>We will be waiting until you verify yourself to unlock functionalities</p> 
                </div>

                )}

                <div onClick={handleLogout}><u>Logout</u></div> 

            </div>

            
        </div>
    )
}
