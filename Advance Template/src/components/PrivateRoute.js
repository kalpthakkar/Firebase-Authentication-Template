import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'


export default function PrivateRoute({ component: Component, ...rest }) {

    const { currentUser } = useAuth()

    return (
        <Route 
            {...rest} 
            render={
                props => {
                    if(currentUser)
                    {
                        if(currentUser.emailVerified)
                        {
                            return <Component {...props} />
                        }
                        else
                        {
                            if(currentUser.providerData[0].providerId === "github.com" || currentUser.providerData[0].providerId === "facebook.com")
                            {
                                return <Component {...props} />
                            }
                            else
                            {
                                return (props.location.pathname !== '/dashboard') ? <Redirect to='/dashboard' /> : <Component {...props} />
                                // Prevents nonVerified loggedIn user to access authenticated routes like update-profile,... (apart from dashboard)
                            }
                        }
                    }
                    else
                    {
                        return <Redirect to='/login' />
                        // Prevents anonymous/unAuthorized user to access internal/private routes like dashboard/update-profile
                    }
                    
                }
            }
        ></Route>
    )
}
