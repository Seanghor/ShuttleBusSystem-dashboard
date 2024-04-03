'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useRef, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { login } from '@/services/auth/login';
import { ToastAction } from '@/components/ui/toast';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { forgetPassword } from '@/services/auth/forgetPassword';



export default function SignInScreen() {
  const userName = useRef('');
  const pass = useRef('');
  const emailForForgetPassword = useRef('');
  const { toast } = useToast();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isForgetPasswordLoading, setIsForgetPasswordLoading] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const onSubmit = async () => {
    try {
      setIsLoginLoading(true);
      const res = await login({
        email: userName.current,
        password: pass.current
      });
      if (res == undefined) {
        toast({
          title: "We're sorry, our server is currently unavailable.",
          description:
            'We are working hard to fix the issue and get back in no time. Please try again in a few moment'
        });
      } else {
        if (res.status === 200) {
          const data = res.json().then((q) => {
            setCookie('token', q['data']['accessToken']);
            setCookie('id', q['data']['user_id']);
            router.replace('/schedules');
          });
        } else if (res.status === 404) {
          toast({
            variant: 'destructive',
            title: 'User Not Found',
            description:
              "We couldn't find a user with the provided credentials. Please check your login information and try again or contact to our team ",
            action: <ToastAction altText='Try again'>Try again</ToastAction>
          });
        } else if (res.status === 401) {
          toast({
            variant: 'destructive',
            title: 'Authentication Failed',
            description:
              'You are not authorized to access this resource. Please ensure you have the correct credentials or contact support for assistance.',
            action: <ToastAction altText='Try again'>Try again</ToastAction>
          });
        } else if (res.status === 409) {
          toast({
            variant: 'destructive',
            title: 'Account Conflict',
            description:
              'You are not authorized to access this resource. Please ensure you have the correct credentials or contact support for assistance.',
            action: <ToastAction altText='Try again'>Try again</ToastAction>
          });
        } else if (res.status === 500) {
          toast({
            variant: 'destructive',
            title: 'Server Error',
            description:
              'Oops! Something went wrong on our end. Please try again later or contact support for further assistance.',
            action: <ToastAction altText='Try again'>Try again</ToastAction>
          });
        } else {
          toast({
            variant: 'destructive',
            title: "We're sorry, our server is currently unavailable.",
            description:
              'We are working hard to fix the issue and get back in no time. Please try again in a few moment',
            action: <ToastAction altText='Try again'>Try again</ToastAction>
          });
        }
        setIsLoginLoading(false);
      }
    } catch (e) {
      toast({
        variant: 'destructive',
        title: "We're sorry, our server is currently unavailable.",
        description:
          'We are working hard to fix the issue and get back in no time. Please try again in a few moment',
        action: <ToastAction altText='Try again'>Try again</ToastAction>
      });
    }
    setIsLoginLoading(false);
  };

  const forgetPasswordRequest = async () => {
    try {
      setIsForgetPasswordLoading(true);
      const res = await forgetPassword({
        email: emailForForgetPassword.current
      });

      if (res.status === 200) {
        toast({
          title: 'Successful',
          description: 'Forget password form sent successfully'
        });
      } else if (res.status === 404) {
        toast({
          variant: 'destructive',
          title: 'User Not Found',
          description:
            'The user account associated with the provided email address was not found.',
          action: <ToastAction altText='Try again'>Try again</ToastAction>
        });
      } else if (res.status === 401) {
        toast({
          variant: 'destructive',
          title: 'Authentication Failed',
          description:
            'The user is not authenticated or does not have the necessary permissions to request a password reset.',
          action: <ToastAction altText='Try again'>Try again</ToastAction>
        });
      } else if (res.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Server Error',
          description:
            'An unexpected error occurred on the server while processing the request.',
          action: <ToastAction altText='Try again'>Try again</ToastAction>
        });
      } else if (res.status === 400) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            'The request was malformed or missing required parameters.',
          action: <ToastAction altText='Try again'>Try again</ToastAction>
        });
      } else if (res.status === 429) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            'The user has exceeded the rate limit for requesting password resets. Retry after a certain period of time.',
          action: <ToastAction altText='Try again'>Try again</ToastAction>
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            'Oops! Something went wrong. Please try again later or contact support for further assistance.',
          action: <ToastAction altText='Try again'>Try again</ToastAction>
        });
      }

      setIsForgetPasswordLoading(false);
      setOpen(false);
    } catch (e) {
      toast({
        variant: 'destructive',
        title: "We're sorry, our server is currently unavailable.",
        description:
          'We are working hard to fix the issue and get back in no time. Please try again in a few moment',
        action: <ToastAction altText='Try again'>Try again</ToastAction>
      });
      setIsForgetPasswordLoading(false);
      setOpen(false);
    }
  };
  return (
    <div className='flex justify-center h-screen items-center backgroundImage bg-cover '>
      <Card className='sm:w-1/3 w-full p-5 bg-background/30 backdrop-blur-sm shadow-md mx-3'>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Welcome to Shuttle Bus Admin System</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='pb-2.5'>
            <Label htmlFor='email' className='pb-2'>
              Email
            </Label>
            <div className='relative block'>
              <MdEmail className='pointer-events-none w-4 h-4 absolute top-1/2 transform -translate-y-1/2 left-3 text-primary' />

              <Input
                type='email'
                name='email'
                id='email'
                placeholder='Enter your email address'
                className='pl-10'
                onChange={(e) => (userName.current = e.target.value)}
              />
            </div>
          </div>

          <div className='pb-2.5'>
            <Label htmlFor='password' className='pb-2'>
              Password
            </Label>
            <div className='relative block'>
              <MdLock className='pointer-events-none w-4 h-4 absolute top-1/2 transform -translate-y-1/2 left-3 text-primary' />
              <Input
                placeholder='Enter your password'
                type={isPasswordVisible ? 'text' : 'password'}
                onChange={(e) => (pass.current = e.target.value)}
                className='pl-10 pr-10'
              />
              {isPasswordVisible ? (
                <MdVisibilityOff
                  className='pointer-events-auto cursor-pointer w-4 h-4 absolute top-1/2 transform -translate-y-1/2 right-3 text-primary'
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <MdVisibility
                  className='pointer-events-auto cursor-pointer w-4 h-4 absolute top-1/2 transform -translate-y-1/2 right-3 text-primary'
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
          </div>

          <div className='flex justify-between'>
            <div className=''></div>
            <div>
              <Dialog open={open} onOpenChange={() => setOpen(!open)}>
                <DialogTrigger asChild>
                  <Button variant='link' className='p-0 text-end flex flex-row'>
                    Forget Password
                  </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[425px]'>
                  <DialogHeader>
                    <DialogTitle>Forget Password</DialogTitle>
                    <DialogDescription>
                      Please provide us with your email and dont forget to check
                      your email inbox or spam
                    </DialogDescription>
                  </DialogHeader>
                  <div className='grid gap-4 py-4'>
                    <div className='grid  items-center gap-2'>
                      <Label htmlFor='email'>Email</Label>
                      <div className='relative block'>
                        <MdEmail className='pointer-events-none w-4 h-4 absolute top-1/2 transform -translate-y-1/2 left-3 text-primary' />

                        <Input
                          type='email'
                          name='email'
                          id='email'
                          placeholder='example@gmail.com'
                          className='pl-10'
                          onChange={(e) =>
                            (emailForForgetPassword.current = e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    {isForgetPasswordLoading ? (
                      <Button
                        variant='default'
                        className='w-full'
                        onClick={forgetPasswordRequest}
                        disabled>
                        Loading ....
                      </Button>
                    ) : (
                      <Button
                        variant='default'
                        className='w-full'
                        onClick={forgetPasswordRequest}>
                        Send
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          {isLoginLoading ? (
            <Button
              variant='default'
              className='w-full'
              onClick={onSubmit}
              disabled>
              Loading ....
            </Button>
          ) : (
            <Button variant='default' className='w-full' onClick={onSubmit}>
              Login
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
