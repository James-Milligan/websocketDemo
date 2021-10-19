package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/apigatewaymanagementapi"
	"os"
)

var apiGatewayClient *apigatewaymanagementapi.ApiGatewayManagementApi


type MessageData struct {
	Data      string `json:"data"`
	ConnectionID string `json:"connectionId"`
}

func init() {
	sessionTemp := session.Must(session.NewSession(&aws.Config{
		Region: aws.String(os.Getenv("AWS_REGION")),
		Endpoint: aws.String("https://fst7ese5o0.execute-api.eu-west-2.amazonaws.com/production"),
	}))
	apiGatewayClient = apigatewaymanagementapi.New(sessionTemp)
}

func main() {
	lambda.Start(Handler)
}

func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	var messageRequest MessageData
	err := json.Unmarshal([]byte(request.Body), &messageRequest)
	if err != nil {
		fmt.Println("Unable to parse JSON request body")
		return events.APIGatewayProxyResponse{Body: "Unable to parse JSON request body", StatusCode: 400, Headers: map[string]string{
			"Access-Control-Allow-Origin": "*",
		}}, nil
	}

	connectionInput := &apigatewaymanagementapi.PostToConnectionInput{
		ConnectionId: aws.String(messageRequest.ConnectionID),
		Data:         []byte(messageRequest.Data),
	}
	_, err = apiGatewayClient.PostToConnection(connectionInput)

	if err != nil {
		fmt.Println(err)
		return events.APIGatewayProxyResponse{Body: "Could not send message", StatusCode: 400, Headers: map[string]string{
			"Access-Control-Allow-Origin": "*",
		}}, nil
	}

	return events.APIGatewayProxyResponse{Body: "BOOF", StatusCode: 200, Headers: map[string]string{
		"Access-Control-Allow-Origin": "*",
	}}, nil
}

