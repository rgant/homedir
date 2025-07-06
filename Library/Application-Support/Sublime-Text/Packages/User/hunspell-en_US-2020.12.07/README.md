# Custom Hunspell Dictionary for Sublime Text

This folder contains a custom Hunspell dictionary for Sublime Text's spell checker.

**Source:**
en_US.dic and en_US.aff files downloaded from the official SCOWL project:
http://wordlist.aspell.net/dicts/
(Specifically, the 'Official Hunspell Dictionaries' section)
Date of download/version: 2020.12.07 (as indicated on the source page)

**Purpose of Customization:**
The en_US.aff file has been modified to include the fancy apostrophe (U+2019 '’) in the WORDCHARS definition.
This allows Sublime Text's spell checker to correctly recognize contractions like "don’t", "can’t", etc., when they use the curly apostrophe, preventing them from being flagged as misspellings.

**Modifications Made:**
- Added '’' to the WORDCHARS line in en_US.aff.
- Added ICONV ’ ' and OCONV ' ’ rules to en_US.aff for robust handling of curly apostrophes.
