// Eligibility rules for Anfààní.
// Conservative on purpose: only claim "yes" when the source actually says so.
// Everything else is "not stated", never guessed.

const EUROPE = [
  "united kingdom", "uk", "england", "ireland", "germany", "france",
  "netherlands", "spain", "portugal", "italy", "sweden", "norway",
  "denmark", "finland", "poland", "belgium", "switzerland", "austria",
  "europe", "emea",
];

export function analyseEligibility(locationText = "", extraText = "") {
  const text = `${locationText} ${extraText}`.toLowerCase();

  const mentionsNigeria = text.includes("nigeria") || /\bng\b/.test(text);
  const mentionsAfrica = text.includes("africa") || mentionsNigeria;
  const mentionsWorldwide =
    text.includes("worldwide") ||
    text.includes("anywhere") ||
    text.includes("global") ||
    text.includes("remote worldwide");

  // A named restriction to a region that is not Nigeria or Africa.
  // Examples: "US only", "United States", "Canada", "Europe only".
  const restrictedMatch =
    text.match(/\b(us|usa|united states|canada|australia|uk only|europe only)\b/) &&
    !mentionsNigeria &&
    !mentionsAfrica &&
    !mentionsWorldwide;

  let openToNigeria = "not stated";
  if (mentionsNigeria || mentionsAfrica || mentionsWorldwide) openToNigeria = "yes";
  else if (restrictedMatch) openToNigeria = "no";

  let scope = "not stated";
  if (mentionsWorldwide) scope = "worldwide";
  else if (mentionsAfrica) scope = "africa";
  else if (mentionsNigeria) scope = "nigeria";
  else if (text.trim()) scope = "country";

  // Timezone overlap with WAT, in hours. Only stated where the region
  // makes it a fact. Worldwide and unspecified locations get null.
  let timezoneOverlapWAT = null;
  if (mentionsNigeria) timezoneOverlapWAT = 8;
  else if (mentionsAfrica) timezoneOverlapWAT = 6;
  else if (EUROPE.some((place) => text.includes(place))) timezoneOverlapWAT = 7;

  return {
    openToNigeria,
    openToAfrica: mentionsAfrica || mentionsWorldwide ? "yes" : "not stated",
    openToWorldwide: mentionsWorldwide ? "yes" : "not stated",
    scope,
    timezoneOverlapWAT,
  };
}
