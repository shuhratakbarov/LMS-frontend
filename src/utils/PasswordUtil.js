export const validatePassword = (pwd) => {
  const validationErrors = [];
  let score = 0;
  if (pwd.length < 8) {
    validationErrors.push(errorMessages.wordLength);
  } else {
    score += 10;
  }
  if (pwd.includes("@") && pwd.includes(".")) {
    validationErrors.push(errorMessages.wordNotEmail);
  } else {
    score += 10;
  }
  if (!/[a-z]/.test(pwd)) {
    validationErrors.push(errorMessages.wordLowercase);
  } else {
    score += 15;
  }
  if (!/[A-Z]/.test(pwd)) {
    validationErrors.push(errorMessages.wordUppercase);
  } else {
    score += 15;
  }
  if (!/\d/.test(pwd)) {
    validationErrors.push(errorMessages.wordOneNumber);
  } else {
    score += 15;
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(pwd)) {
    validationErrors.push(errorMessages.wordOneSpecialChar);
  } else {
    score += 15;
  }

  if (numSequences.some(seq => pwd.toLowerCase().includes(seq)) ||
    alphaSequences.some(seq => pwd.toLowerCase().includes(seq)) ||
    qwertySequences.some(seq => pwd.toLowerCase().includes(seq))) {
    validationErrors.push(errorMessages.wordSequences);
    score -= 10;
  } else {
    score += 10;
  }

  if (pwd.length > 12) score += 10;
  if (pwd.length > 16) score += 10;
  return { score: Math.max(0, Math.min(100, score)), errors: validationErrors };
};

export const getVerdict = (score) => {
  if (score < 30) return "Very Weak";
  if (score < 50) return "Weak";
  if (score < 70) return "Fair";
  if (score < 90) return "Good";
  if (score < 100) return "Strong";
  return "Perfect";
};

export const getProgressStatus = (score) => {
  if (score < 30) return "exception";
  if (score < 70) return "normal";
  return "success";
};

export const getProgressColor = (score) => {
  if (score < 30) return "#ff4d4f";
  if (score < 50) return "#fa8c16";
  if (score < 70) return "#fadb14";
  if (score < 90) return "#1890ff";
  if (score < 100) return "#52c41a";
  return "#722ed1";
};

export const generateSecurePassword = (length = 12) => {
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  // Use browser's crypto API
  const secureRandomInt = (max) => {
    const randomValues = new Uint32Array(1);
    window.crypto.getRandomValues(randomValues);
    return randomValues[0] % max;
  };

  const secureShuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = secureRandomInt(i + 1);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const hasSequence = (password) => {
    const lower = password.toLowerCase();
    return [...numSequences, ...alphaSequences, ...qwertySequences].some(seq =>
      lower.includes(seq) || lower.includes(seq.split("").reverse().join(""))
    );
  };

  const generatePassword = () => {
    let password = "";
    password += upperCase[secureRandomInt(upperCase.length)];
    password += digits[secureRandomInt(digits.length)];
    password += special[secureRandomInt(special.length)];

    const allChars = upperCase + lowerCase + digits + special;
    for (let i = password.length; i < length; i++) {
      password += allChars[secureRandomInt(allChars.length)];
    }

    return secureShuffle(password.split("")).join("");
  };

  let password;
  let attempts = 0;
  do {
    password = generatePassword();
    attempts++;
  } while (hasSequence(password) && attempts < 50);

  return password;
};

const errorMessages = {
  wordLength: "Password must be at least 8 characters long",
  wordNotEmail: "Password should not be an email address",
  wordSequences: "Password should not contain sequences",
  wordLowercase: "Password must contain at least one lowercase letter",
  wordUppercase: "Password must contain at least one uppercase letter",
  wordOneNumber: "Password must contain at least one number",
  wordOneSpecialChar: "Password must contain at least one special character"
};

const numSequences = ["012", "123", "234", "345", "456", "567", "678", "789"];
const alphaSequences = ["abc", "bcd", "cde", "def", "efg", "fgh", "ghi", "hij", "ijk", "jkl", "klm", "lmn", "mno", "nop", "opq", "pqr", "qrs", "rst", "stu", "tuv", "uvw", "vwx", "wxy", "xyz"];
const qwertySequences = ["qwe", "wer", "ert", "rty", "tyu", "yui", "uio", "iop", "asd", "sdf", "dfg", "fgh", "ghj", "hjk", "jkl", "zxc", "xcv", "cvb", "vbn", "bnm"];
