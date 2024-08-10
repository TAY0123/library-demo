"use client";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Component } from "react";

import { Book } from "@/components/library";

interface BookCardProps {
  book: Book;
}

class BookCard extends Component<BookCardProps> {
  state = { result: "", loading: false, available: this.props.book.available };

  handleReserve = async () => {
    this.setState({ result: "pending", loading: true });
    let resp = await fetch("/api/reserve", {
      method: "POST",
      redirect: "manual",
      body: JSON.stringify({ bookID: this.props.book._id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (resp.status != 200) {
      window.location.href = "/login";
    } else if (resp.ok) {
      this.setState({
        result: "success",
        loading: false,
        available: this.state.available - 1,
      });
    } else {
      this.setState({
        result: "error" + resp.json(),
        loading: false,
      });
    }
  };

  render() {
    const { book } = this.props;

    return (
      <div>
        <Card
          isPressable
          className="bg-default-100 w-full h-full max-w-sm rounded-lg shadow overflow-hidden p-0 m-0 "
          onPress={() => {
            if (window !== undefined) {
              window.location.href = `/book/${book._id}`;
            }
          }}
        >
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large text-left">{book.name}</h4>
            <p className="text-tiny uppercase font-bold">{book.author}</p>
            <small className="text-default-500">{book.category}</small>
          </CardHeader>
          <CardBody className="overflow-visible py-10" />
          <CardFooter className="pb-0 pt-2 pb-4 px-4 flex-col items-start space-y-2 ">
            <span className="text-default-500 font-bold">
              Avaliable: {this.state.available}
            </span>

            <Popover placement="bottom">
              <PopoverTrigger>
                <Button
                  className="bg-blue-500 text-white w-full rounded py-2 px-4 hover:bg-blue-600"
                  isLoading={this.state.loading}
                  onClick={this.handleReserve}
                >
                  Reserve
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="px-1 py-2">
                  <div className="text-small font-bold">Status</div>
                  <div className="text-tiny">{this.state.result}</div>
                </div>
              </PopoverContent>
            </Popover>
          </CardFooter>
        </Card>
      </div>
    );
  }
}

export default BookCard;
