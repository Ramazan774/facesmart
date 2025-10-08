import React, { useState } from 'react';

function Register({ loadUser, onRouteChange }) {
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

  const onNameChange = (event) => {
        setRegisterUsername(event.target.value);
    }

    const onEmailChange = (event) => {
        setRegisterEmail(event.target.value);
    }

    const onPasswordChange = (event) => {
        setRegisterPassword(event.target.value);
    }

    const onSubmitRegister = async () => {
        if(!registerEmail || !registerUsername || !registerPassword) {
            setError('Please fill in all fields.');
            return;
        }

        if(registerPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: registerEmail,
                    password: registerPassword,
                    name: registerUsername
                })
            });

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            if(data.user && data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                loadUser(data.user);
                onRouteChange('home');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError(
                error.message || 'Unable to register. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
     };

     const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSubmitRegister();
    }
  };

        return (
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Register</legend>

                            {error && (
                                <div className="mv3 pa2 ba b--red bg-washed-red red">
                                    {error}
                                </div>
                            )}

                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                                <input
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={registerUsername}
                                    onChange={onNameChange}
                                    onKeyDown={handleKeyDown}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                    type="email"
                                    name="email-address"
                                    id="email-address"
                                    value={registerEmail}
                                    onChange={onEmailChange}
                                    onKeyDown={handleKeyDown}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input
                                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={registerPassword}
                                    onChange={onPasswordChange}
                                    onKeyDown={handleKeyDown}
                                    disabled={isLoading}
                                />
                            </div>
                        </fieldset>
                        <div className="mv3">
                            <input
                                onClick={onSubmitRegister}
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                                type="submit"
                                value={isLoading ? "Registering..." : "Register"}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </main>
            </article>
        );
    };


export default Register;