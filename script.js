const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handelSlider();
//set strength circle color to grey
setIndicator("#ccc");

//set password length
function handelSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRandomInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol() {
    return symbols.charAt(getRandomInteger(0, symbols.length));
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbols = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNumber = true;
    if (symbolsCheck.checked) hasSymbols = true;

    if (hasUpper && hasLower && (hasNumber || hasLower) && passwordLength >= 8)
        setIndicator('#0f0');
    else if ((hasUpper || hasLower) && (hasNumber || hasLower) && passwordLength >= 6)
        setIndicator('#ff0');
    else
        setIndicator('#f00');
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = 'Copied';
    } catch (e) {
        copyMsg.innerText = 'Failed';
    }
    //to make span visible
    copyMsg.classList.add('active');
    setTimeout(() => { copyMsg.classList.remove('active'); }, 2000)
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = '';
    array.forEach((el) => (str += el));
    return str;
}

function handelCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((ckeckbox) => {
        if (ckeckbox.checked) {
            checkCount++;
        }
    });

    //special condition for password length
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handelSlider();
    }
}

allCheckBox.forEach((ckeckbox) => {
    ckeckbox.addEventListener('change', handelCheckBoxChange)
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handelSlider();
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    //none of the checked box are selected
    if (checkCount <= 0)
        return;
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handelSlider();
    }
    //journey to find new password
    //remove old password
    password = "";
    let funcArr = [];
    if (uppercaseCheck.checked) {
        funcArr.push(generateUpperCase);
    }
    if (lowercaseCheck.checked) {
        funcArr.push(generateLowerCase);
    }
    if (numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }
    if (symbolsCheck.checked) {
        funcArr.push(generateSymbol);
    }
    //compulsary addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    //remaining adition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        password += funcArr[getRandomInteger(0, funcArr.length)]();
    }
    //shuffle the password
    password = shufflePassword(Array.from(password));
    //show the value of password in UI
    passwordDisplay.value = password;
    //calculate strength
    calcStrength();
});