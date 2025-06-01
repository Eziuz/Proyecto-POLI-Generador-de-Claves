"use strict";
function getRandomLower() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}
function getRandomUpper() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}
function getRandomNumber() {
	return +String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}
function getRandomSymbol() {
	const symbols = "!@#$%{}_-[]";
	return symbols[Math.floor(Math.random() * symbols.length)];
}
const randomFunc = {
	lower: getRandomLower,
	upper: getRandomUpper,
	number: getRandomNumber,
	symbol: getRandomSymbol,
};

// Click event for generate button
const generate = document.getElementById("generateBtn");
generate.addEventListener("click", () => {
	handleGeneratePassword();
});

const handleGeneratePassword = () => {
	const length = document.getElementById("passwordLength").value;
	const hasUpper = document.getElementById("uppercase").checked;
	const hasLower = document.getElementById("lowercase").checked;
	const hasNumber = document.getElementById("numbers").checked;
	const hasSymbol = document.getElementById("symbols").checked;
	const result = document.getElementById("passwordResult");
	result.value = generatePassword(
		hasLower,
		hasUpper,
		hasNumber,
		hasSymbol,
		length
	);
};

// Function for generate password
function generatePassword(lower, upper, number, symbol, length) {
	let generatePassword = "";
	const typesCount = lower + upper + number + symbol;
	const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(
		(item) => Object.values(item)[0]
	);

	for (let i = 0; i < length; i += typesCount) {
		typesArr.forEach((type) => {
			const funcName = Object.keys(type)[0];
			generatePassword += randomFunc[funcName]();
		});
	}
	const finalPassword = generatePassword.slice(0, length);
	return finalPassword;
}

// Function for copy to clipboard
let button = document.getElementById("clipboardBtn");
button.addEventListener("click", (e) => {
	e.preventDefault();
	const inputPassword = document.getElementById("passwordResult");
	inputPassword.select();
	inputPassword.setSelectionRange(0, 99999);
	navigator.clipboard.writeText(inputPassword.value);
	handleAlert("Contraseña copiada al portapapeles");
});

// Validate password
const handleValidatePassword = (input) => {
	const inputPassword = input;
	const { value: password } = inputPassword;
	const lengthMin = document.getElementById("passwordMinLength").value;
	const messageError = document.getElementById("messageError");
	const validateUpper = document.getElementById("validateUppercase").checked;
	const validateLower = document.getElementById("validateLowercase").checked;
	const validateNumber = document.getElementById("validateNumbers").checked;
	const validateSymbol = document.getElementById("validateSymbols").checked;

	const resValidate = validatePassword(
		lengthMin,
		password,
		validateUpper,
		validateLower,
		validateNumber,
		validateSymbol
	);

	if (resValidate.isSucces) {
		messageError.classList.remove("message-error");
		messageError.innerText = "";
	} else {
		messageError.classList.add("message-error");
		messageError.innerText = resValidate.message;
	}
};

const validatePassword = (
	lengthMin,
	password,
	validateUpper,
	validateLower,
	validateNumber,
	validateSymbol
) => {
	const longitudMin = new RegExp(`^.{${lengthMin},}$`);
	const hasUpper = /[A-Z]/;
	const hasLower = /[a-z]/;
	const hasNumber = /\d/;
	const hasSymbol = /[!@#$%{}_\-\[\]]/;

	if (!longitudMin.test(password)) {
		return {
			isSucces: false,
			message: `La contraseña debe tener al menos ${lengthMin} caracteres`,
		};
	}

	if (validateUpper && !hasUpper.test(password)) {
		return {
			isSucces: false,
			message: "La contraseña debe contener al menos una letra mayúscula",
		};
	}

	if (validateLower && !hasLower.test(password)) {
		return {
			isSucces: false,
			message: "La contraseña debe contener al menos una letra minúscula",
		};
	}

	if (validateNumber && !hasNumber.test(password)) {
		return {
			isSucces: false,
			message: "La contraseña debe contener al menos un número",
		};
	}

	if (validateSymbol && !hasSymbol.test(password)) {
		return {
			isSucces: false,
			message: "La contraseña debe contener al menos un símbolo",
		};
	}

	return {
		isSucces: true,
		message: "La contraseña es válida",
	};
};

document.addEventListener("DOMContentLoaded", () => {
	handleGeneratePassword();
	const inputPassword = document.getElementById("password");
	inputPassword.addEventListener("change", () =>
		handleValidatePassword(inputPassword)
	);

	const passwordLength = document.getElementById("passwordMinLength");
	passwordLength.addEventListener("change", () =>
		handleValidatePassword(inputPassword)
	);

	const settingsValidator = document.getElementById("settingsValidator");
	const settins = settingsValidator.getElementsByClassName("substituted");

	for (let i = 0; i < settins.length; i++) {
		const checkbox = settins[i];
		checkbox.addEventListener("change", () =>
			handleValidatePassword(inputPassword)
		);
	}

	const formValidation = document.getElementById("formValidator");
	formValidation.addEventListener("submit", (e) => {
		e.preventDefault();
		const { value: password } = inputPassword;
		const lengthMin = document.getElementById("passwordMinLength").value;
		const messageError = document.getElementById("messageError");
		const validateUpper = document.getElementById("validateUppercase").checked;
		const validateLower = document.getElementById("validateLowercase").checked;
		const validateNumber = document.getElementById("validateNumbers").checked;
		const validateSymbol = document.getElementById("validateSymbols").checked;

		const resValidate = validatePassword(
			lengthMin,
			password,
			validateUpper,
			validateLower,
			validateNumber,
			validateSymbol
		);

		if (resValidate.isSucces) {
			messageError.classList.remove("message-error");
			messageError.innerText = "";
			handleAlert("La contraseña es válida");
			// e.target.submit();
		} else {
			messageError.classList.add("message-error");
			messageError.innerText = resValidate.message;
		}
	});

	const iconShowPassword = document.getElementById("iconShowPassword");

	iconShowPassword.addEventListener("click", () => {
		const inputPassword = document.getElementById("password");
		const isVisible = inputPassword.type === "password";
		inputPassword.type = isVisible ? "text" : "password";
		iconShowPassword.querySelector("span").classList.toggle("bi-eye-slash");
		iconShowPassword.querySelector("span").classList.toggle("bi-eye");
	});
});

// System alert

const handleAlert = (message) => {
	const containerAlert = document.getElementById("containerAlert");
	const alert = document.createElement("div");
	alert.classList.add("alert");
	alert.classList.add("show");
	alert.innerText = message;
	setTimeout(() => {
		alert.classList.remove("show");
		alert.classList.add("hide");
	}, 1000);
	containerAlert.appendChild(alert);
};