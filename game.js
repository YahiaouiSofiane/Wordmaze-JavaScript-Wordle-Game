// Start Game Panel
const selectDictionaryButton = document.getElementsByName('languageButton')
const selectNumberButton = document.getElementsByName('numberButton')
const startButton = document.querySelector('.start__game__button')

selectDictionaryButton.forEach(button => {
    button.addEventListener('click' , () => {
        removeSelectedLanguagePreference()
        button.classList.add('selected__language')
        checkStartGame()
    })
})
selectNumberButton.forEach(button => {
    button.addEventListener('click' , () => {
        removeSelectedNumberPreference()
        button.classList.add('selected__number')
        checkStartGame()
    })
})

function removeSelectedLanguagePreference () {
    selectDictionaryButton.forEach(button => button.classList.remove('selected__language'))
}
function removeSelectedNumberPreference () {
    selectNumberButton.forEach(button => button.classList.remove('selected__number'))
}

function checkStartGame () {
    const dictionaryArr = [...selectDictionaryButton]
    const numberArr = [...selectNumberButton]
    
    let langChecker = dictionaryArr.some(dictionary => dictionary.classList.contains('selected__language'))
    let numChecker = numberArr.some(number => number.classList.contains('selected__number'))

    if (langChecker && numChecker) {
        startButton.classList.add('active__start__button')
        startButton.onclick = () => startGame ()
    }
}

function startGame () {
    document.querySelector('.game__name').classList.add('display__none')
    document.querySelector('.game__name__settings').classList.add('display__game')
    document.querySelector('.game__start').classList.add('hide__start__game')
    document.querySelector('.game__settings').classList.add('display__settings')
    document.querySelector('.game__area').classList.add('display__game')
    document.querySelector('.game__keyboard').classList.add('display__game')
    settingsValue()
    getData()
}
// End Game Panel

// Start Fetching 
function getData () {
    let languageSelectedValue = document.querySelector('.selected__language').value
    let numberSelectedValue = document.querySelector('.selected__number').value

    switch (languageSelectedValue) {
        case 'EN' : 
            fetchData('English',numberSelectedValue)
        break;
        case 'FR' : 
            fetchData('French',numberSelectedValue)
        break;
    }
}

async function fetchData (language,number) {
    try {
        const dataResponse = await fetch(`./words/${language}/${number} letter words.json`)
        if (!dataResponse.ok) throw new Error (`Network Error ${dataResponse.statusText}`)
        const myData = await dataResponse.json()
        getRandomWord(myData)
    } 
    catch (error) {
        console.error(`404 ${error}`)
    }
}

function getRandomWord (myData) {
    let randomNumber = Math.floor(Math.random() * myData.length)
    let chosenWord = myData[randomNumber]
    createInputs(chosenWord.length)
    gameLogic(chosenWord)
}

function createInputs (numberOfInputs) {
    const gameArea = document.querySelector('.game__area')
    const numberOfTries = 6

    for (let i = 1; i <= numberOfTries; i++) {
        const inputContainer = document.createElement('div')
        inputContainer.className = `input__container row${i}`
        for (let j = 0; j < numberOfInputs; j++) {
            const input = document.createElement('input')
            input.type = 'text'
            input.name = 'inputs'
            input.disabled = 'disabled'
            input.className = 'inputs'
            input.maxLength = '1'
            inputContainer.appendChild(input)
        }
        gameArea.appendChild(inputContainer)
    }
}

function gameLogic (chosenWord) {
    let currentRow = 1
    let currentIndex = 0
    let userAnswer = []
    const keyboardButtons = document.querySelectorAll('.keyboard')

    function normalTyping (e) {
        let allInputs = document.querySelectorAll(`.row${currentRow} .inputs`)
        const chars = 'AZERTYUIOPQSDFGHJKLMWXCVBNÀÊÈÉÙÇ';
        if (chars.includes(e.key.toUpperCase()) && currentIndex < allInputs.length) {
            handleInputs(allInputs,currentIndex,e.key)
            userAnswer.push(e.key.toLowerCase())
            currentIndex++
        }
        if (e.key === 'Backspace' && currentIndex > 0) {
            currentIndex--
            deleteCharacter(allInputs,currentIndex)
            userAnswer.pop()
        }
        if (e.key === 'Enter' && isInputEmpty(allInputs)) {
            compareAnswers(userAnswer,[...chosenWord.toLowerCase()],allInputs,keyboardButtons)
            if (isAnswerCorrect(allInputs)) {
                endGame('You Won!', chosenWord)
            } 
            else {
                currentIndex = 0
                userAnswer = []
                currentRow++
            }

            if (currentRow === 7) {
                endGame('You Lost!', chosenWord)
            }
        }
    }

    function gameKeyboardTyping (button) {
        let allInputs = document.querySelectorAll(`.row${currentRow} .inputs`)
        if (button.value !== 'DELETE' && button.value !== 'ENTER' && currentIndex < allInputs.length) {
            handleInputs(allInputs,currentIndex,button.value)
            userAnswer.push(button.value.toLowerCase())
            currentIndex++
        }
        if (button.value === 'DELETE' && currentIndex > 0) {
            currentIndex--
            deleteCharacter(allInputs,currentIndex)
            userAnswer.pop()
        }
        if (button.value === 'ENTER' && isInputEmpty(allInputs)) {
            compareAnswers(userAnswer,[...chosenWord.toLowerCase()],allInputs,keyboardButtons)
            if (isAnswerCorrect(allInputs)) {
                endGame('You Won!', chosenWord)
            } 
            else {
                currentIndex = 0
                userAnswer = []
                currentRow++
            }

            if (currentRow === 7) {
                endGame('You Lost!', chosenWord)
            }
        }
    }

    document.addEventListener('keyup',normalTyping)
    keyboardButtons.forEach(button => button.onclick = () => {gameKeyboardTyping(button)})
}

function handleInputs (allInputs,currentIndex,value) {
    let currentInput = allInputs[currentIndex]
    currentInput.value = value
}

function deleteCharacter (allInputs,currentIndex) {
    let currentInput = allInputs[currentIndex]
    currentInput.value = ''
}

function isInputEmpty (inputs) {
    let inputArr = [...inputs]
    let checker = inputArr.every(input => input.value !== '')
    return checker
}

function compareAnswers (userAnswer,chosenWord,allInputs,keyboardButtons) {

    let keyboardArray = [...keyboardButtons]

    for (let i = 0; i < chosenWord.length; i++) {
    
        if(chosenWord[i] === userAnswer[i]) {
            allInputs[i].classList.add('correct')
            keyboardArray.forEach(key => {
                if (key.value.toLowerCase() === userAnswer[i]) key.classList.add('correct')
            })
        }

        if (chosenWord.indexOf(userAnswer[i]) !== -1 && userAnswer[i] !== chosenWord[i]) {
            allInputs[i].classList.add('partial')
            keyboardArray.forEach(key => {
                if (key.value.toLowerCase() === userAnswer[i]) key.classList.add('partial')
            })
        }
        
        if (!chosenWord.includes(userAnswer[i])) {
            allInputs[i].classList.add('wrong')
            keyboardArray.forEach(key => {
                if (key.value.toLowerCase() === userAnswer[i]) key.classList.add('wrong')
            })
        }
    } 

}

function isAnswerCorrect (inputs) {
    let inputsArr = [...inputs]
    let checker = inputsArr.every(input => input.classList.contains('correct'))
    return checker
}

function endGame(status,chosenWord) {
    setTimeout(() => {
        document.querySelector('.game__area').classList.remove('display__game')
        document.querySelector('.game__keyboard').classList.remove('display__game')
        document.querySelector('.game__end').classList.add('display__end__game')
        document.querySelector('.language__selected').disabled = 'disabled'
        document.querySelector('.letters__selected').disabled = 'disabled'
        document.querySelector('.tooltip').disabled = 'disabled'
    
        document.querySelector('.status').textContent = status
        document.querySelector('.status__word').textContent = `The Word Was : ${chosenWord}`
    
        const playAgain = document.querySelector('.play__again')
        playAgain.onclick = () => location.reload()
    },1000)
}

// Theme Dark Mode & Light Mode
const lightModeToggler = document.querySelector('.light')
const darkModeToggler = document.querySelector('.dark')

localStorage.getItem('theme') ? darkMode() : lightMode()

lightModeToggler.onclick = () => {
    darkMode()
    localStorage.setItem('theme' , 'dark__mode')
}
darkModeToggler.onclick = () => {
    lightMode()
    localStorage.removeItem('theme')
}

function darkMode () {
    document.body.classList.add('dark__mode')
    lightModeToggler.classList.add('display__none')
    darkModeToggler.classList.remove('display__none')
}

function lightMode () {
    document.body.classList.remove('dark__mode')
    lightModeToggler.classList.remove('display__none')
    darkModeToggler.classList.add('display__none')
}

// Banners & Settings Buttons
const settingsLanguageButton = document.querySelector('.language__selected')
const settingsLettersButton = document.querySelector('.letters__selected')
const settingsTooltipButton = document.querySelector('.tooltip')

const languageBanner = document.querySelector('.language__banner')
const lettersBanner = document.querySelector('.letters__banner')
const tooltipBanner = document.querySelector('.tooltip__banner')
const closeBanner = document.querySelectorAll('.close__banner')
const allBanners = document.querySelectorAll('.banners')


settingsLanguageButton.onclick = () => {
    activeBannerButton(settingsLanguageButton)
    hideAllBanners()
    languageBanner.classList.add('display__banner')
    hideGame ()
}
settingsLettersButton.onclick = () => {
    activeBannerButton(settingsLettersButton)
    hideAllBanners()
    lettersBanner.classList.add('display__banner')
    hideGame ()
}
settingsTooltipButton.onclick = () => {
    activeBannerButton(settingsTooltipButton)
    hideAllBanners()
    tooltipBanner.classList.add('display__banner')
    hideGame ()
}
closeBanner.forEach(closeButton => {
    closeButton.onclick = () => {
        hideAllBanners()
        removeActiveBannerButton(closeButton)
        hideGame()
    }
})

function hideAllBanners () {
    allBanners.forEach(banner => banner.classList.remove('display__banner'))
}

function activeBannerButton (button) {
    removeActiveBannerButton ()
    button.classList.add('active__banner')
}

function removeActiveBannerButton () {
    settingsLanguageButton.classList.remove('active__banner')
    settingsLettersButton.classList.remove('active__banner')
    settingsTooltipButton.classList.remove('active__banner')
}

function hideGame () {
    let bannersArray = [...allBanners]
    let checker = bannersArray.some(banner => banner.classList.contains('display__banner'))

    if (checker) {
        document.querySelector('.game__area').classList.remove('display__game')
        document.querySelector('.game__keyboard').classList.remove('display__game')
    } else {
        document.querySelector('.game__area').classList.add('display__game')
        document.querySelector('.game__keyboard').classList.add('display__game')
    }
}

function settingsValue () {
    let languageSelectedValue = document.querySelector('.selected__language').value
    let numberSelectedValue = document.querySelector('.selected__number').value

    document.querySelector('.language__selected').textContent = languageSelectedValue
    document.querySelector('.letters__selected').textContent = `0${numberSelectedValue}`

    const languageBannerSpan = document.querySelectorAll('.banner__language')
    const letterBannerSpan = document.querySelectorAll('.banner__number')

    languageBannerSpan.forEach(span => {
        if (span.getAttribute('data-value') === languageSelectedValue) span.style.cssText = 'background-color : var(--main-green-color); color : #fafafa'
    })
    letterBannerSpan.forEach(span => {
        if (span.getAttribute('data-value') === numberSelectedValue) span.style.cssText = 'background-color : var(--main-green-color); color : #fafafa'
    })
}