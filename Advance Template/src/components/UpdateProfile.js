import React, {useRef, useState} from 'react'
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom'

export default function UpdateProfile() {

    const newEmailRef = useRef()
    const confirmCurrentPasswordRef = useRef()
    const newPasswordRef = useRef()
    const { currentUser, reauthenticateUser, updateEmail, updatePassword } = useAuth()
    const [ error, setError ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const [ category, setUpdateCategory ] = useState('email')

    function handleSubmit(e) {
        e.preventDefault()

        const promises = []
        setLoading(true)
        setError('')

        promises.push(reauthenticateUser(confirmCurrentPasswordRef.current.value))

        Promise.all(promises).then(() => {
            
            // Reauthentication Successful

            if(category === 'email')
            {
                if(newEmailRef.current.value === currentUser.email) {
                    setLoading(false)
                    return setError('This account is already registered with ' + newEmailRef.current.value)
                } else {
                    promises.pop()
                    promises.push(updateEmail(newEmailRef.current.value))
                }
            } 
            else if(category === 'password') 
            {
                if(confirmCurrentPasswordRef.current.value === newPasswordRef.current.value) {
                    setLoading(false)
                    return setError('Invalid input: Current password and new password must be different')
                } else {
                    promises.pop()
                    promises.push(updatePassword(newPasswordRef.current.value))
                }
            }

            Promise.all(promises).then(() => {
                console.log('Updated Successfully')
                /* 
                    We could redirect to dashboard after update                    
                    Include: const history = useHistory()
                    Update: import { Link, useHistory } from 'react-router-dom'
                    Syntax: history.push('/dashboard')
                */
            }).catch(() => {
                setError('Failed to update')
            }).finally(() => {
                setLoading(false)
            })

        }).catch(() => {
            setError('Invalid password credentials')
        }).finally(() => {
            setLoading(false)
        })
    }
    
    function changeUpdateCategory(newCategory) {
        if(category === 'email' && newCategory === 'password') 
        {
            document.querySelectorAll('input')[0].value = '';
        }
        if(newCategory === 'email') {
            document.querySelectorAll('input')[0].value = currentUser.email;
        }
        setUpdateCategory(newCategory)
    }

    return (
        <div>
            <h2>Update Profile</h2>

            {error && <p>{error}</p>}

            <div>

                <div>
                    <p onClick={() => changeUpdateCategory('email')}><u>Update Email</u></p>
                    <p onClick={() => changeUpdateCategory('password')}><u>Update Password</u></p>
                </div>

                <div>
                    <h3>Change settings</h3>
                    <form onSubmit={handleSubmit}>
                    <div>
                    {
                        {
                        'email': <div>
                                    <input type="text" ref={newEmailRef} placeholder="Enter new email" defaultValue={currentUser.email} required></input> 
                                    <br/> 
                                    <input type="password" ref={confirmCurrentPasswordRef} placeholder="Current Password" required></input>
                                    <br/>
                                </div>,
                        'password': <div>
                                        <input type="password" ref={confirmCurrentPasswordRef} placeholder="Current Password" required></input>
                                        <br/>
                                        <input type="password" ref={newPasswordRef} placeholder="New Password" required></input>
                                        <br/>
                                    </div>
                        }[category]
                    }
                    </div>
                        
                        <input type="submit" disabled={loading}></input>

                    </form>
                </div>
            </div>

            <br/>
            
            <div>
                <Link to='/dashboard'><u>Cancel</u></Link> 
            </div>
        </div>
    )
}
