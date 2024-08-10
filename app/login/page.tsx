import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import React from "react";

export default function LoginPage() {
  return (
    <div>
      <div className="flex flex-col justify-center items-center ">
        <h1 className="text-3xl w-full max-w-md">Login</h1>
        <br />
        <form action="/api/auth" className="w-full max-w-md" method="post">
          <Card className="w-full max-w-md">
            <CardBody className="space-y-4">
              <div className="space-y-2">
                <Input isRequired label="Email" name="username" type="email" />
              </div>
              <div className="space-y-2">
                <Input
                  isRequired
                  label="Password"
                  name="password"
                  type="password"
                />
              </div>
            </CardBody>
            <CardFooter className="flex flex-col space-y-2">
              <Button className="w-full bg-green-500" type="submit">
                Login
              </Button>
            </CardFooter>
          </Card>
        </form>
        <div className="mt-4">
          <span className="text-sm">Don&apos;t have an account? </span>
          <Link className="text-sm text-blue-500" href="/register">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
