import puppeteer from "puppeteer";
import randUserAgent from "rand-user-agent";

export const scrapeFiverrProfile = async (url) => {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });

  const page = await browser.newPage();
  const agent = randUserAgent("desktop");

  let notFound = false;
  page.on("response", async (response) => {
    // Redirection means the page was not found
    if (response.status() === 302 && response.url() === url) {
      notFound = true;
    }
  });

  await page.setUserAgent(agent);
  await page.goto(url);

  const profileData = await page.evaluate(() => {
    const name = document.querySelector(".username-line > a")?.textContent;

    const location = document.querySelector(
      ".user-stats .location b"
    )?.textContent;

    const description = document.querySelector(
      ".seller-profile .description p"
    )?.textContent;

    let overallRating = document.querySelector(
      ".rating-score.rating-num"
    )?.textContent;
    overallRating = overallRating ? Number(overallRating) : overallRating;

    const languageElements = document.querySelectorAll(".languages ul li");
    const languages = Array.from(languageElements).map((lang) => {
      const langAndProficiency = lang?.textContent.split("-");
      const [language, proficiency] = langAndProficiency;
      return { lang: language.trim(), proficiency: proficiency.trim() };
    });

    const skillsElements = document.querySelectorAll(".skills ul li a");
    const skills = Array.from(skillsElements).map((skill) => {
      return skill?.textContent.trim();
    });

    const educationLists = document.querySelectorAll(".education-list ul li");
    const education = Array.from(educationLists).map((educationElement) => {
      const [degreeElement, institutionElement] = educationElement.children;
      return {
        degree: degreeElement?.textContent,
        institution: institutionElement?.textContent,
      };
    });

    const notableClientsElements = document.querySelectorAll(".client-name");
    let notableClients = Array.from(notableClientsElements).map(
      (clientElement) => {
        return clientElement?.textContent;
      }
    );
    notableClients = Array.from(new Set(notableClients));

    let numOfReviews = document.querySelector(
      ".reviews-header h2 span span"
    )?.textContent;
    numOfReviews = Number(numOfReviews?.split(",").join(""));

    const starCountersElements =
      document.querySelectorAll(".stars-counters tr");

    function removeParentheses(stringifiedNum) {
      const openingParenIndex = stringifiedNum.indexOf("(");
      const closingParenIndex = stringifiedNum.indexOf(")");
      return stringifiedNum.slice(openingParenIndex + 1, closingParenIndex);
    }

    const starCounters = Array.from(starCountersElements).map(
      (starCounterElement) => {
        let [typeElement, _, countElement] = starCounterElement.children;
        type = typeElement.querySelector("button")?.textContent;
        count = removeParentheses(countElement?.textContent);
        count = Number(count?.split(",").join(""));

        return { type, count };
      }
    );

    const ratingBreakdownElements = document.querySelectorAll(".ranking ul li");

    const ratingBreakdown = Array.from(ratingBreakdownElements).map(
      (ratingBreakdownElement) => {
        let [textElement, ratingElement] = ratingBreakdownElement?.childNodes;

        return {
          type: textElement?.textContent,
          rating: Number(ratingElement?.textContent),
        };
      }
    );

    const skillTestsElements = document.querySelectorAll(".skill-tests ul li");
    const skillTests = Array.from(skillTestsElements).map(
      (skillTestElement) => {
        const [skillElement, scoreElement, statusElement] =
          skillTestElement?.childNodes;
        const skill = skillElement?.textContent;
        const scorePercentage = eval(scoreElement?.textContent);
        const status = statusElement?.textContent;

        return { skill, scorePercentage, status };
      }
    );

    return {
      name,
      location,
      education,
      description,
      overallRating,
      languages,
      skills,
      notableClients,
      numOfReviews,
      ratingBreakdown,
      starCounters,
      skillTests,
    };
  });

  if (notFound) {
    const err = new Error("Page not found");
    err.statusCode = 404;
    throw err;
  }

  await browser.close();

  return profileData;
};
