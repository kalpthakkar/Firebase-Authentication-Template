import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext';

/*
    Custom Email Action Handler
    Firebase Documentation: https://firebase.google.com/docs/auth/custom-email-handler

    Manage User in Firebase
    https://firebase.google.com/docs/auth/web/manage-users
*/

export default function AccountActions() {

    const urlSearchParams = new URLSearchParams(window.location.search);
    const queryParams = Object.fromEntries(urlSearchParams.entries());

    /* Possible query parameters: 
        queryParams.mode, 
        queryParams.oobCode, 
        queryParams.apiKey, 
        queryParams.continueUrl, 
        queryParams.lang
    */

    const { verifyPasswordResetCode, resetPassword, verifyEmail, verifyEmailRecoveryCode, recoverEmail, requestNewPassword } = useAuth()
    const [ actionHTML, setActionHTML ] = useState()
    const newPasswordRef = useRef()
    const promises = []

    function handleResetPassword() {
        promises.push(verifyPasswordResetCode(queryParams.oobCode))
        Promise.all(promises).then(() => {

            setActionHTML(
                <div>
                    <p>Enter a new password</p>
                    <form id="forget-password-form">
                        <input type="password" ref={newPasswordRef} placeholder="New Password" />
                        <input type="submit"/>
                    </form>
                </div>
            )

            document.querySelector('#forget-password-form').addEventListener('submit', (e) => {
                e.preventDefault();

                // TODO: Implement form validation here

                promises.pop()
                promises.push(resetPassword(queryParams.oobCode, newPasswordRef.current.value))

                Promise.all(promises).then(() => {

                    setActionHTML(
                        <p>Successfully updated!</p>
                    )

                }).catch(() => {

                    setActionHTML(
                        <p>Failed to update your password</p>
                    )

                })

            })

        }).catch(() => {

            setActionHTML(
                <p>Oops! Link is invalid</p>
            )

        })
    }

    function handleRecoverEmail() {
        // Confirm the action code is valid.
        promises.push(verifyEmailRecoveryCode(queryParams.oobCode))
        Promise.all(promises).then(() => {
            // Revert to the old email
            promises.pop()
            promises.push(recoverEmail(queryParams.oobCode))
            Promise.all(promises).then(() => {
                // Giving user an option to reset their password 
                // in case the account was compromised
                promises.pop()
                promises.push(requestNewPassword('forRestoredEmail'))
                Promise.all(promises).then(() => {
                    setActionHTML(
                        <div>
                            <p>Successfull restored your email</p>
                            <p>Check your email to update your password if you think, your account was compromised</p>
                        </div>
                    )
                }).catch(() => {
                    setActionHTML(
                        <div>
                            <p>Successfull restored your email</p>
                            <p>
                                Failed to send password recovery link to your email. 
                                If your password is not working, try using #forgot-password to get a password reset link.
                            </p>
                            <p>If you think your account was compromised, you can contact us @contact</p>
                        </div>
                    )
                })
            }).catch(() => {
                setActionHTML(
                    <div>
                        <p>Failed to restore your old email</p>
                        <p>If you think your account was compromised, you can contact us @contact</p>
                    </div>
                )
            })

        }).catch(() => {
                setActionHTML(
                    <p>Oops! Link is invalid or expired</p>
                )
        })
    }

    function handleVerifyEmail() {
        promises.push(verifyEmail(queryParams.oobCode))
        Promise.all(promises).then(() => {
            
            setActionHTML(
                <div>
                    <p>Email successfully got verified</p>
                </div>
            )

        }).catch(() => {

            setActionHTML(
                <p>Oops! Link is invalid</p>
            )
            
        })
    }

    const initialize = () => {
        // Handle the user management action.
        switch (queryParams.mode) {
            case 'resetPassword':
                handleResetPassword();
                break
            case 'recoverEmail':
                handleRecoverEmail();
                break
            case 'verifyEmail':
                handleVerifyEmail()
                break
            case 'verifyAndChangeEmail':
                handleVerifyEmail()
                break
            default:
                // Error: invalid mode.
        }
    }

    useEffect(() => {
        const unsubscribe = initialize()
        return unsubscribe
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <h3>Account Actions (Global display message for every action)</h3>
            {actionHTML}
        </div>
    )
}