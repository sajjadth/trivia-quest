package services

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"

	"github.com/sajjadth/trivia-quest/internals/models"
)

// function for creating open trivia db url
func getOpenTriviaUrl(amount, category int, difficulty, questinoType string) string {
	url := "https://opentdb.com/api.php?"
	if amount != 0 && amount <= 20 {
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

// for adding correct answer to incorrect ones and shuffle it
func shuffleAnswers(q *models.Question) {
	q.IncorrectAnswers = append(q.IncorrectAnswers, q.CorrectAnswer)
	if q.Type != "boolean" {
		index := rand.Intn(4)
		if index != 3 {
			q.IncorrectAnswers[3], q.IncorrectAnswers[index] = q.IncorrectAnswers[index], q.IncorrectAnswers[3]
		}
	} else {
		index := rand.Intn(2)
		if index != 1 {
			q.IncorrectAnswers[1], q.IncorrectAnswers[index] = q.IncorrectAnswers[index], q.IncorrectAnswers[1]
		}
	}
}

// encrypting the correct answer and shuffle the options and returning SerializedQuestionResponse
func encryptQuestions(questions *models.QuestionList) []models.SerializedQuestionResponse {
	var output []models.SerializedQuestionResponse
	for _, q := range questions.Questions {
		res, _ := Encrypt(q.CorrectAnswer)
		shuffleAnswers(q)
		q.CorrectAnswer = res
		output = append(output, *q.ToSerializedQuestion())
	}
	return output
}

func GetQuestions(amount, category int, difficulty, questinoType string) ([]models.SerializedQuestionResponse, error) {
	var questions models.QuestionList
	var output []models.SerializedQuestionResponse

	// getting open trivia db link
	openTriviaUrl := getOpenTriviaUrl(amount, category, difficulty, questinoType)

	// send get request to opne trivia db
	res, err := http.Get(openTriviaUrl)
	if err != nil {
		log.Println(err)
		return output, fmt.Errorf("something went wrong please try again later")
	}

	// decode reqponse of get request
	err = json.NewDecoder(res.Body).Decode(&questions)
	if err != nil {
		log.Fatal(err)
		return output, fmt.Errorf("something went wrong please try again later")
	}

	output = encryptQuestions(&questions)

	// check for any error in open trivia db
	if questions.ResponseCode != 0 {
		log.Println("open trivia db response code: ", questions.ResponseCode)
		return output, fmt.Errorf("something went wrong please try again later")
	}

	return output, nil
}
