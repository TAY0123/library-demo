"use client";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { MdSettings } from "react-icons/md";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/table";
import { Tooltip } from "@nextui-org/tooltip";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import React from "react";

const bcolumns = [
  {
    key: "name",
    label: "Book",
  },
  {
    key: "date",
    label: "Date",
  },
  {
    key: "action",
    label: "Action",
  },
];

const rcolumns = [
  {
    key: "name",
    label: "Book",
  },
  {
    key: "date",
    label: "Date",
  },
  {
    key: "action",
    label: "Action",
  },
];

const Dashboard = () => {
  let tablecontent = (
    <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
  );

  let reservedtablecontent = (
    <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
  );
  let c: any;
  const [userInfo, setUserInfo] = useState(c);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user", { redirect: "manual" })
      .then((response) => {
        if (!response.ok) {
          window.location.href = "/login";
        }

        return response.json();
      })
      .then((data) => {
        for (let index = 0; index < data.reserved.length; index++) {
          data.reserved[index].action = (
            <Button
              className="w-full bg-red-500"
              onClick={() => {
                fetch("/api/reserve", {
                  method: "DELETE",
                  redirect: "manual",
                  body: JSON.stringify({ bookID: data.reserved[index].bookID }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                }).then((response) => {
                  if (!response.ok) {
                    window.location.href = "/login";
                  }
                  window.location.reload();
                });
              }}
            >
              Cancel
            </Button>
          );
        }
        setUserInfo(data);
        setLoading(false);
      });
  }, []);

  if (userInfo) {
    if (userInfo.borrowed.length > 0) {
      tablecontent = (
        <TableBody items={userInfo.borrowed}>
          {(item: any) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      );
    }

    if (userInfo.reserved.length > 0) {
      reservedtablecontent = (
        <TableBody items={userInfo.reserved}>
          {(item: any) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      );
    }
  }

  let content;

  if (loading) {
    content = (
      <div className="container mx-auto p-4 flex flex-col items-center gap-4 max-w-5xl">
        <div className="text-3xl font-bold pb-4">Loading...</div>
        <Spinner />
      </div>
    );
  } else {
    content = (
      <div className="container mx-auto p-4 flex flex-col items-start gap-4 max-w-5xl">
        <div className="flex place-content-between flex-row w-full">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <div>
            <Tooltip content="Settings">
              <Button isIconOnly aria-label="Like" color="primary">
                <MdSettings />
              </Button>
            </Tooltip>
          </div>
        </div>
        <Card className="p-6 rounded-lg shadow-md w-full">
          <CardHeader>
            <h3>Your Borrowed Books</h3>
          </CardHeader>
          <CardBody>
            <Table aria-label="table for borrowed books">
              <TableHeader columns={bcolumns}>
                {(column) => (
                  <TableColumn key={column.key}>{column.label}</TableColumn>
                )}
              </TableHeader>
              {tablecontent}
            </Table>
          </CardBody>
        </Card>
        <Card className="p-6 rounded-lg shadow-md w-full">
          <CardHeader>
            <div className="w-full flex flex-col">
              <h3>Your Reserved Books</h3>
              <h5 className="text-sm text-default-500">
                Maximum 5 books can be reserved
              </h5>
            </div>
          </CardHeader>
          <CardBody>
            <Table aria-label="table for reserved books">
              <TableHeader columns={rcolumns}>
                {(column) => (
                  <TableColumn key={column.key}>{column.label}</TableColumn>
                )}
              </TableHeader>
              {reservedtablecontent}
            </Table>
          </CardBody>
        </Card>
      </div>
    );
  }

  return content;
};

export default Dashboard;
