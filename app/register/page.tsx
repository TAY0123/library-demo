"use client";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import React from "react";

export default function RegisterPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
    setPasswordMatch(event.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (event: any) => {
    setConfirmPassword(event.target.value);
    setPasswordMatch(password === event.target.value);
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center ">
        <h1 className="text-3xl w-full max-w-md">Register</h1>
        <br />
        <form action="/api/register" className="w-full max-w-md" method="post">
          <Card className="w-full max-w-md">
            <CardBody className="space-y-4">
              <div className="space-y-2">
                <Input isRequired label="Email" name="email" type="email" />
              </div>
              <div className="space-y-2">
                <Input
                  isRequired
                  label="Username"
                  name="username"
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <Input
                  isRequired
                  label="Password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="space-y-2">
                <Input
                  isRequired
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
                {!passwordMatch && (
                  <p className="text-red-500">Passwords do not match</p>
                )}
              </div>
            </CardBody>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                className="w-full bg-blue-500"
                disabled={!passwordMatch}
                type="submit"
              >
                Register
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
