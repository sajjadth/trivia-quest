package services

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/sajjadth/trivia-quest/internals/models"
)

// function for creating open trivia db url
func getOpenTriviaUrl(amount, category int, difficulty, questinoType string) string {
	url := "https://opentdb.com/api.php?encode=base64"
	if amount != 0 {
		url = fmt.Sprintf("%v&amount=%v", url, amount)
	} else {
		url = fmt.Sprintf("%v&amount=%v", url, 10)
	}
	if category != 0 {
		url = fmt.Sprintf("%v&category=&%v", url, category)
	}
	if difficulty != "" {
		url = fmt.Sprintf("%v&difficulty=%v", url, difficulty)
	}
	if questinoType != "" {
		url = fmt.Sprintf("%v&type=%v", url, questinoType)
	}

	return url
}

func GetQuestions(amount, category int, difficulty, questinoType string) (models.Questions, error) {
	var questions models.Questions

	// getting open trivia db link
	openTriviaUrl := getOpenTriviaUrl(amount, category, difficulty, questinoType)

	// send get request to opne trivia db
	res, err := http.Get(openTriviaUrl)
	if err != nil {
		log.Println(err)
		return questions, fmt.Errorf("something went wrong please try again later")
	}

	// decode reqponse of get request
	err = json.NewDecoder(res.Body).Decode(&questions)
	if err != nil {
		log.Fatal(err)
		return questions, fmt.Errorf("something went wrong please try again later")
	}

	// check for any error in open trivia db
	if questions.ResponseCode != 0 {
		log.Println("open trivia db response code: ", questions.ResponseCode)
		return questions, fmt.Errorf("something went wrong please try again later")
	}

	return questions, nil
}
