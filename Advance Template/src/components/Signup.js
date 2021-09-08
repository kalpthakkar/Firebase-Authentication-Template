import React, {useRef, useState} from 'react'
import { useAuth } from '../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom'

export default function Signup() {

    const usernameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    const { signup } = useAuth()
    const [ error, setError ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()

        if(passwordRef.current.value !== confirmPasswordRef.current.value) {
            return setError('Password do not match')
        }

        try {
            setError('')
            setLoading(true)
            await signup(usernameRef.current.value, emailRef.current.value, passwordRef.current.value)
            history.push('/dashboard')
        } catch {
            setError('Failed to create an account')
            setLoading(false)
        }
    }

    return (
        <div>
            <div><h2>Sign Up</h2></div>
            <div>
                {error && <p>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" ref={usernameRef} placeholder="Username" required></input>
                    <br/>
                    <input type="text" ref={emailRef} placeholder="Email" required></input>
                    <br/>
                    <input type="password" ref={passwordRef} placeholder="Password" required></input>
                    <br/>
                    <input type="password" ref={confirmPasswordRef} placeholder="Confirm password" required></input>
                    <br/>
                    <input type="submit" disabled={loading}></input>
                </form>
            </div>
            <div>
                <p>
                    Already have an account? 
                    <Link to='/login'>Login</Link> 
                </p>
            </div>
        </div>
    )
}
