import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { LuPencil } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { UserResponse } from '@/types/user';
import { Checkbox } from '@/components/ui/checkbox';
import { GetBatchPrefix } from '@/lib/getBatchPrefix';
import RequiredField from '@/components/requiredField';

interface UserModelProps {
  isEdit: boolean;
  batchData: any[];
  onSaveUser?: (
    role: string,
    email: string,
    userName: string,
    password: string,
    department: string,
    gender: string,
    inKrr: boolean,
    batchNum: number
  ) => Promise<void>;
  onEditUser?: (
    userId: string,
    role: string,
    email: string,
    userName: string,
    password: string,
    department: string,
    gender: string,
    inKrr: boolean,
    batchNum: number
  ) => Promise<void>;
  selectedUser?: UserResponse;
}

export default function UserModel(props: UserModelProps) {
  const { isEdit, batchData, onSaveUser, selectedUser, onEditUser } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<any>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [includePassword, setIncludePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isUserInKirirom, setIsUserInKirirom] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState('');

  const validateEmail = (email: any) => {
    const domain = '@kit.edu.kh';
    const regex = new RegExp(`^[^@\\s]+${domain}$`);
    if (!regex.test(email)) {
      setErrorMessage(`Email must end with ${domain}`);
    } else {
      setErrorMessage('');
    }
  };

  const formValidate = () => {
    const commonValidation =
      userName.trim() !== '' &&
      userEmail.endsWith('@kit.edu.kh') &&
      selectedGender !== '' &&
      selectedRole !== '' &&
      password.trim() !== '' &&
      confirmPassword === password &&
      errorMessage === '' &&
      passwordErrorMessage === '' &&
      confirmPasswordErrorMessage === '';

    let roleSpecificValidation = true;
    if (selectedRole === 'STUDENT') {
      roleSpecificValidation =
        selectedDepartment !== '' && selectedBatch !== '';
    }

    return commonValidation && roleSpecificValidation;
  };

  const isFormEditValid = () => {
    const basicValidation =
      userName.trim() !== '' &&
      userEmail.endsWith('@kit.edu.kh') &&
      selectedGender !== '' &&
      selectedRole !== '' &&
      errorMessage === '';

    if (!includePassword) {
      return basicValidation;
    }

    const passwordValidation =
      password.trim() !== '' &&
      confirmPassword === password &&
      passwordErrorMessage === '' &&
      confirmPasswordErrorMessage === '';

    return basicValidation && passwordValidation;
  };

  const validatePassword = (currentPassword: any) => {
    if (currentPassword.length < 5) {
      setPasswordErrorMessage('Password must be at least 5 characters.');
    } else if (currentPassword !== confirmPassword && confirmPassword !== '') {
      setPasswordErrorMessage('Passwords do not match.');
    } else {
      setPasswordErrorMessage('');
      setConfirmPasswordErrorMessage('');
    }
  };

  const validateConfirmPassword = (
    currentPassword: any,
    currentConfirmPassword: any
  ) => {
    if (currentPassword !== currentConfirmPassword) {
      setConfirmPasswordErrorMessage('Passwords do not match.');
    } else {
      setConfirmPasswordErrorMessage('');
      setPasswordErrorMessage('');
    }
  };

  const handleAction = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    if (onSaveUser) {
      onSaveUser(
        selectedRole,
        userEmail,
        userName,
        password,
        selectedDepartment,
        selectedGender,
        true,
        Number(selectedBatch)
      );
    }

    if (onEditUser) {
      onEditUser(
        userId,
        selectedRole,
        userEmail,
        userName,
        password,
        selectedDepartment,
        selectedGender,
        isUserInKirirom,
        Number(selectedBatch)
      );
    }
    setIsLoading(false);
    resetData();
  };

  const resetData = () => {
    setOpen(false);
    setUserName('');
    setUserEmail('');
    setSelectedGender('');
    setSelectedRole('');
    setSelectedDepartment('');
    setSelectedBatch('');
    setPassword('');
    setConfirmPassword('');
    setPasswordErrorMessage('');
    setErrorMessage('');
    setConfirmPasswordErrorMessage('');
    setIncludePassword(false);
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          resetData();
        }
      }}>
      <DialogTrigger asChild>
        {isEdit === true ? (
          <LuPencil
            className='cursor-pointer'
            onClick={() => {
              console.log(selectedUser);
              setUserId(selectedUser!.id);
              setUserName(selectedUser!.username);
              setUserEmail(selectedUser!.email);
              setSelectedGender(selectedUser!.gender);
              setSelectedRole(selectedUser!.role);
              console.log(selectedUser);
              setSelectedDepartment(
                selectedUser!.studentInfo?.batch?.department
              );
              setSelectedBatch(selectedUser!.studentInfo?.batch?.batchNum);
              setIsUserInKirirom(selectedUser!.inKRR);
            }}
          />
        ) : (
          <Button className='' variant='default' size='lg'>
            <FaPlus className='mr-5' />
            Add New User
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className={'overflow-y-scroll max-h-[80vh]'}>
        <DialogHeader>
          {isEdit === true ? (
            <>
              <DialogTitle>Edit User</DialogTitle>
              <RequiredField />
              <div className='flex flex-col'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
                  <div className='flex flex-col'>
                    <Label htmlFor='driver name' isRequired className='pb-2'>
                      Username
                    </Label>
                    <Input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>

                  <div className='flex flex-col'>
                    <Label htmlFor='driver name' isRequired className='pb-2'>
                      Email
                    </Label>
                    <Input
                      value={userEmail}
                      onChange={(e) => {
                        const email = e.target.value;
                        setUserEmail(email);
                        validateEmail(email);
                      }}
                    />
                    {errorMessage && (
                      <p className='text-red-500 text-xs mt-1'>
                        {errorMessage}
                      </p>
                    )}
                  </div>
                </div>
                <div className='flex flex-col mt-5'>
                  <Label htmlFor='driver name' isRequired className='pb-2'>
                    Gender
                  </Label>
                  <Select
                    defaultValue={selectedGender}
                    onValueChange={(value) => setSelectedGender(value)}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select Gender' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='MALE'>Male</SelectItem>
                      <SelectItem value='FEMALE'>Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='flex flex-col mt-5'>
                  <Label htmlFor='driver name' isRequired className='pb-2'>
                    Role
                  </Label>
                  <Select
                    defaultValue={selectedRole}
                    onValueChange={(value) => {
                      setSelectedRole(value);
                      if (value !== 'STUDENT') {
                        setSelectedDepartment('');
                        setSelectedBatch('');
                      }
                    }}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select Role' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='STUDENT'>Student</SelectItem>
                      <SelectItem value='ADMIN'>Admin</SelectItem>
                      <SelectItem value='STAFF'>Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedRole === 'STUDENT' && (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
                    <div className='flex flex-col'>
                      <Label htmlFor='From' isRequired className='pb-2'>
                        Department
                      </Label>

                      <Select
                        defaultValue={selectedDepartment}
                        onValueChange={(value) => setSelectedDepartment(value)}>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select Department' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='SOFTWAREENGINEERING'>
                            Software Engineering
                          </SelectItem>
                          <SelectItem value='TOURISMANDMANAGEMENT'>
                            Tourism and Management
                          </SelectItem>
                          <SelectItem value='ARCHITECTURE'>
                            Architecture
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='flex flex-col'>
                      <Label htmlFor='From' isRequired className='pb-2'>
                        Batch
                      </Label>

                      <Select
                        defaultValue={selectedBatch}
                        onValueChange={(value) => {
                          setSelectedBatch(value), console.log(selectedBatch);
                        }}>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select Batch' />
                        </SelectTrigger>
                        <SelectContent>
                          {batchData
                            .filter(
                              (batch) => batch.department === selectedDepartment
                            )
                            .map((filteredBatch) => (
                              <SelectItem
                                key={filteredBatch.id}
                                value={filteredBatch.batchNum}>
                                {`${GetBatchPrefix(selectedDepartment)}${
                                  filteredBatch.batchNum
                                }`}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className='flex items-center space-x-2 mt-5'>
                  <Checkbox
                    id='change password'
                    onClick={() => setIncludePassword(!includePassword)}
                  />
                  <Label htmlFor='terms'>Change Password</Label>
                </div>

                {includePassword && (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
                    <div className='flex flex-col'>
                      <Label htmlFor='password' className='pb-2' isRequired>
                        Password
                      </Label>
                      <div className='relative block'>
                        <Input
                          placeholder='Enter new password'
                          type={isPasswordVisible ? 'text' : 'password'}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            validatePassword(e.target.value);
                          }}
                          className=' pr-10'
                        />
                        {isPasswordVisible ? (
                          <MdVisibilityOff
                            className='pointer-events-auto cursor-pointer w-4 h-4 absolute top-1/2 transform -translate-y-1/2 right-3 text-primary'
                            onClick={() =>
                              setIsPasswordVisible(!isPasswordVisible)
                            }
                          />
                        ) : (
                          <MdVisibility
                            className='pointer-events-auto cursor-pointer w-4 h-4 absolute top-1/2 transform -translate-y-1/2 right-3 text-primary'
                            onClick={() =>
                              setIsPasswordVisible(!isPasswordVisible)
                            }
                          />
                        )}
                      </div>
                      {passwordErrorMessage && (
                        <p className='text-red-500 text-xs mt-1'>
                          {passwordErrorMessage}
                        </p>
                      )}
                    </div>
                    <div className='flex flex-col'>
                      <Label htmlFor='password' className='pb-2' isRequired>
                        Confirm Password
                      </Label>
                      <div className='relative block'>
                        <Input
                          placeholder='Enter new password'
                          type={isConfirmPasswordVisible ? 'text' : 'password'}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            validateConfirmPassword(password, e.target.value);
                          }}
                          className=' pr-10'
                        />
                        {isConfirmPasswordVisible ? (
                          <MdVisibilityOff
                            className='pointer-events-auto cursor-pointer w-4 h-4 absolute top-1/2 transform -translate-y-1/2 right-3 text-primary'
                            onClick={() =>
                              setIsConfirmPasswordVisible(
                                !isConfirmPasswordVisible
                              )
                            }
                          />
                        ) : (
                          <MdVisibility
                            className='pointer-events-auto cursor-pointer w-4 h-4 absolute top-1/2 transform -translate-y-1/2 right-3 text-primary'
                            onClick={() =>
                              setIsConfirmPasswordVisible(
                                !isConfirmPasswordVisible
                              )
                            }
                          />
                        )}
                      </div>
                      {confirmPasswordErrorMessage && (
                        <p className='text-red-500 text-xs mt-1'>
                          {confirmPasswordErrorMessage}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <div className='mt-10'>
                  <Button
                    className='w-full'
                    variant='default'
                    disabled={!isFormEditValid() || isLoading}
                    onClick={handleAction}>
                    {isLoading ? 'Loading' : 'Save change'}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogTitle>Add New User</DialogTitle>
              <div className='flex flex-col'>
                <RequiredField />
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-10'>
                  <div className='flex flex-col'>
                    <Label htmlFor='driver name' isRequired className='pb-2'>
                      Username
                    </Label>
                    <Input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>

                  <div className='flex flex-col'>
                    <Label htmlFor='driver name' isRequired className='pb-2'>
                      Email
                    </Label>
                    <Input
                      value={userEmail}
                      onChange={(e) => {
                        const email = e.target.value;
                        setUserEmail(email);
                        validateEmail(email);
                      }}
                    />
                    {errorMessage && (
                      <p className='text-red-500 text-xs mt-1'>
                        {errorMessage}
                      </p>
                    )}
                  </div>
                </div>

                <div className='flex flex-col mt-5'>
                  <Label htmlFor='driver name' isRequired className='pb-2'>
                    Gender
                  </Label>
                  <Select onValueChange={(value) => setSelectedGender(value)}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select Gender' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='MALE'>Male</SelectItem>
                      <SelectItem value='FEMALE'>Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='flex flex-col mt-5'>
                  <Label htmlFor='driver name' isRequired className='pb-2'>
                    Role
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      setSelectedRole(value);
                      if (value !== 'STUDENT') {
                        setSelectedDepartment('');
                        setSelectedBatch('');
                      }
                    }}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select Role' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='STUDENT'>Student</SelectItem>
                      <SelectItem value='ADMIN'>Admin</SelectItem>
                      <SelectItem value='STAFF'>Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedRole === 'STUDENT' && (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
                    <div className='flex flex-col'>
                      <Label htmlFor='From' isRequired className='pb-2'>
                        Department
                      </Label>

                      <Select
                        onValueChange={(value) => setSelectedDepartment(value)}>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select Department' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='SOFTWAREENGINEERING'>
                            Software Engineering
                          </SelectItem>
                          <SelectItem value='TOURISMANDMANAGEMENT'>
                            Tourism and Management
                          </SelectItem>
                          <SelectItem value='ARCHITECTURE'>
                            Architecture
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='flex flex-col'>
                      <Label htmlFor='From' className='pb-2' isRequired>
                        Batch
                      </Label>

                      <Select
                        onValueChange={(value) => {
                          setSelectedBatch(value), console.log(selectedBatch);
                        }}>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select Batch' />
                        </SelectTrigger>
                        <SelectContent>
                          {batchData
                            .filter(
                              (batch) => batch.department === selectedDepartment
                            )
                            .map((filteredBatch) => (
                              <SelectItem
                                key={filteredBatch.id}
                                value={filteredBatch.batchNum}>
                                {`${GetBatchPrefix(selectedDepartment)}${
                                  filteredBatch.batchNum
                                }`}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
                  <div className='flex flex-col'>
                    <Label htmlFor='password' isRequired className='pb-2'>
                      Password
                    </Label>
                    <div className='relative block'>
                      <Input
                        placeholder='Enter your password'
                        type={isPasswordVisible ? 'text' : 'password'}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          validatePassword(e.target.value);
                        }}
                        className=' pr-10'
                      />
                      {isPasswordVisible ? (
                        <MdVisibilityOff
                          className='pointer-events-auto cursor-pointer w-4 h-4 absolute top-1/2 transform -translate-y-1/2 right-3 text-primary'
                          onClick={() =>
                            setIsPasswordVisible(!isPasswordVisible)
                          }
                        />
                      ) : (
                        <MdVisibility
                          className='pointer-events-auto cursor-pointer w-4 h-4 absolute top-1/2 transform -translate-y-1/2 right-3 text-primary'
                          onClick={() =>
                            setIsPasswordVisible(!isPasswordVisible)
                          }
                        />
                      )}
                    </div>
                    {passwordErrorMessage && (
                      <p className='text-red-500 text-xs mt-1'>
                        {passwordErrorMessage}
                      </p>
                    )}
                  </div>
                  <div className='flex flex-col'>
                    <Label isRequired htmlFor='password' className='pb-2'>
                      Confirm Password
                    </Label>
                    <div className='relative block'>
                      <Input
                        placeholder='Enter your password'
                        type={isConfirmPasswordVisible ? 'text' : 'password'}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          validateConfirmPassword(password, e.target.value);
                        }}
                        className=' pr-10'
                      />
                      {isConfirmPasswordVisible ? (
                        <MdVisibilityOff
                          className='pointer-events-auto cursor-pointer w-4 h-4 absolute top-1/2 transform -translate-y-1/2 right-3 text-primary'
                          onClick={() =>
                            setIsConfirmPasswordVisible(
                              !isConfirmPasswordVisible
                            )
                          }
                        />
                      ) : (
                        <MdVisibility
                          className='pointer-events-auto cursor-pointer w-4 h-4 absolute top-1/2 transform -translate-y-1/2 right-3 text-primary'
                          onClick={() =>
                            setIsConfirmPasswordVisible(
                              !isConfirmPasswordVisible
                            )
                          }
                        />
                      )}
                    </div>
                    {confirmPasswordErrorMessage && (
                      <p className='text-red-500 text-xs mt-1'>
                        {confirmPasswordErrorMessage}
                      </p>
                    )}
                  </div>
                </div>
                <div className='mt-10'>
                  <Button
                    className='w-full'
                    variant='default'
                    disabled={!formValidate() || isLoading}
                    onClick={handleAction}>
                    {isLoading ? 'Loading' : 'Add'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
