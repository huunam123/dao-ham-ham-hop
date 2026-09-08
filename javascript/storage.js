class StorageManager {
    constructor() {
        this.defaultData = {
            questions: [
                {
                    id: 1,
                    function: 'y = (3x² + 2x + 1)⁵',
                    answer: '5*(3x^2+2x+1)^4*(6x+2)',
                    hint: 'Áp dụng quy tắc chuỗi: (u^n)\' = n*u^(n-1)*u\'',
                    solution: 'Đặt u = 3x² + 2x + 1, n = 5\ny\' = 5*(3x² + 2x + 1)⁴ * (6x + 2)',
                    difficulty: 'medium'
                },
                {
                    id: 2,
                    function: 'y = √(x³ + 2x)',
                    answer: '(1/(2*sqrt(x^3+2x)))*(3x^2+2)',
                    hint: 'Viết lại dưới dạng lũy thừa: √u = u^(1/2)',
                    solution: 'y = (x³ + 2x)^(1/2)\ny\' = (1/2)(x³ + 2x)^(-1/2) * (3x² + 2)',
                    difficulty: 'easy'
                },
                {
                    id: 3,
                    function: 'y = sin(2x² + 3x)',
                    answer: 'cos(2x^2+3x)*(4x+3)',
                    hint: '(sin u)\' = cos u * u\'',
                    solution: 'Đặt u = 2x² + 3x\ny\' = cos(2x² + 3x) * (4x + 3)',
                    difficulty: 'medium'
                },
                {
                    id: 4,
                    function: 'y = e^(x³ + 2x)',
                    answer: 'e^(x^3+2x)*(3x^2+2)',
                    hint: '(e^u)\' = e^u * u\'',
                    solution: 'Đặt u = x³ + 2x\ny\' = e^(x³ + 2x) * (3x² + 2)',
                    difficulty: 'easy'
                },
                {
                    id: 5,
                    function: 'y = ln(5x³ + 2x² + 1)',
                    answer: '(1/(5x^3+2x^2+1))*(15x^2+4x)',
                    hint: '(ln u)\' = u\'/u',
                    solution: 'Đặt u = 5x³ + 2x² + 1\ny\' = (15x² + 4x) / (5x³ + 2x² + 1)',
                    difficulty: 'medium'
                }
            ],
            currentQuestionIndex: 0,
            stats: {
                correct: 0,
                wrong: 0,
                total: 0
            }
        };
        
        this.loadData();
    }

    loadData() {
        const stored = localStorage.getItem('derivativeQuizData');
        if (!stored) {
            this.saveData(this.defaultData);
        }
    }

    getData() {
        const stored = localStorage.getItem('derivativeQuizData');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Lỗi parse data:', e);
                return this.defaultData;
            }
        }
        return this.defaultData;
    }

    saveData(data) {
        localStorage.setItem('derivativeQuizData', JSON.stringify(data));
    }

    addQuestion(questionData) {
        const data = this.getData();
        questionData.id = Date.now();
        data.questions.push(questionData);
        this.saveData(data);
        return questionData;
    }

    deleteQuestion(id) {
        const data = this.getData();
        data.questions = data.questions.filter(q => q.id !== id);
        this.saveData(data);
    }

    exportData() {
        const data = this.getData();
        return JSON.stringify(data, null, 2);
    }

    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.questions && Array.isArray(data.questions)) {
                this.saveData(data);
                return true;
            }
            return false;
        } catch (e) {
            console.error('Lỗi import:', e);
            return false;
        }
    }

    clearAll() {
        this.saveData(this.defaultData);
    }
}