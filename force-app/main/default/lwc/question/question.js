import { LightningElement,track } from 'lwc';

export default class Question extends LightningElement {


    @track showAnswer1 = false;
    @track showAnswer2 = false;
    @track showAnswer3 = false;
    @track selectedQuestionId = null;

    get questionClass1() {
        return this.selectedQuestionId === '1' ? 'question selected' : 'question';
    }

    get questionClass2() {
        return this.selectedQuestionId === '2' ? 'question selected' : 'question';
    }

    get questionClass3() {
        return this.selectedQuestionId === '3' ? 'question selected' : 'question';
    }

    get answerClass1() {
        return this.showAnswer1 ? 'answer active' : 'answer';
    }

    get answerClass2() {
        return this.showAnswer2 ? 'answer active' : 'answer';
    }

    get answerClass3() {
        return this.showAnswer3 ? 'answer active' : 'answer';
    }

    toggleAnswer(event) {
        const id = event.currentTarget.dataset.id;
        if (id === '1') {
            this.showAnswer1 = !this.showAnswer1;
            this.selectedQuestionId = this.showAnswer1 ? '1' : null;
        } else if (id === '2') {
            this.showAnswer2 = !this.showAnswer2;
            this.selectedQuestionId = this.showAnswer2 ? '2' : null;
        } else if (id === '3') {
            this.showAnswer3 = !this.showAnswer3;
            this.selectedQuestionId = this.showAnswer3 ? '3' : null;
        }
    }
}


