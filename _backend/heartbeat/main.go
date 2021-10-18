package main

import (
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func main() {
	lambda.Start(Handler)
}

func Handler() (events.APIGatewayProxyResponse, error) {
	fmt.Println("Keep alive received")
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       "OK",
	}, nil
}
