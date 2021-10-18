package main

import (
	"context"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/apigateway"
	"github.com/aws/aws-sdk-go/service/apigatewaymanagementapi"
	"os"
)

var apiGatewayClient *apigateway.APIGateway
var apiGatewayWebsocketClient *apigatewaymanagementapi.ApiGatewayManagementApi


type ConnectionItem struct {
	ConnectionID string `json:"connectionID"`
}

type MessageData struct {
	ConnectionID string `json:"connectionId"`
}

func init() {
	sessionTemp := session.Must(session.NewSession(&aws.Config{
		Region: aws.String(os.Getenv("AWS_REGION")),
	}))
	apiGatewayClient = apigateway.New(sessionTemp)
	sessionTemp = session.Must(session.NewSession(&aws.Config{
		Region: aws.String(os.Getenv("AWS_REGION")),
		Endpoint: aws.String("https://fst7ese5o0.execute-api.eu-west-2.amazonaws.com/production"),
	}))
	apiGatewayWebsocketClient = apigatewaymanagementapi.New(sessionTemp)

}

func main() {
	lambda.Start(Handler)
}

func Handler(ctx context.Context, request events.APIGatewayWebsocketProxyRequest) (events.APIGatewayProxyResponse, error) {
	connectionItem := ConnectionItem{
		ConnectionID: request.RequestContext.ConnectionID,
	}

	fmt.Println("Connection established: " + connectionItem.ConnectionID)
	fmt.Println(request.PathParameters)

	//jsonData, _ := json.Marshal(connectionItem)
	//
	//connectionInput := &apigatewaymanagementapi.PostToConnectionInput{
	//	ConnectionId: aws.String(connectionItem.ConnectionID),
	//	Data:         jsonData,
	//}
	//_, err := apiGatewayWebsocketClient.PostToConnection(connectionInput)
	//
	//if err != nil {
	//	fmt.Println(err)
	//	return events.APIGatewayProxyResponse{Body: "Could not send message", StatusCode: 400}, nil
	//}

	return events.APIGatewayProxyResponse{Body: "BOOF", StatusCode: 200}, nil
}
