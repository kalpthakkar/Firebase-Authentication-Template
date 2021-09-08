import React, {useRef, useState} from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

export default function Login() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [ error, setError ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            history.push('/dashboard')
        } catch {
            setError('Failed to login')
            setLoading(false)
        }
    }

    return (
        <div>
            <h2>Log In</h2>
            <div>
                {error && <p>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" ref={emailRef} placeholder='Email' required></input>
                    <br/>
                    <input type="password" ref={passwordRef} placeholder='Password' required></input>
                    <br/>
                    <input type="submit" disabled={loading}></input>
                </form>
            </div>

            <br/>

            <div>
                <Link to='/forgot-password'>Forgot Password?</Link>
            </div>

            <br/>

            <div>
                <p>
                    Create an account? 
                    <Link to='/signup'>SignUp</Link> 
                </p>
            </div>
        </div>
    )
}
