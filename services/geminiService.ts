import { GoogleGenAI } from "@google/genai";

let apiKeys: string[] = [];
let currentKeyIndex = 0;

/**
 * Sets the API keys to be used for Gemini API calls.
 * @param keys An array of API key strings.
 */
export function setApiKeys(keys: string[]) {
  apiKeys = keys;
  currentKeyIndex = 0; // Reset index when keys are updated
}

/**
 * Gets a GoogleGenAI instance with the next API key in a round-robin fashion.
 * @throws An error if no API keys are available.
 * @returns A GoogleGenAI instance.
 */
function getAiInstance(): GoogleGenAI {
  if (apiKeys.length === 0) {
    throw new Error("No API keys provided. Please add at least one API key in the settings.");
  }

  const key = apiKeys[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length; // Move to the next key
  
  if (!key) {
    // This case should ideally not be hit if the array is filtered properly, but as a safeguard:
    throw new Error(`Invalid API key at index ${currentKeyIndex > 0 ? currentKeyIndex - 1 : apiKeys.length - 1}. Key is empty.`);
  }
  
  return new GoogleGenAI({ apiKey: key });
}


/**
 * Parses a Gemini API error and returns a user-friendly message.
 * @param error The error object from the catch block.
 * @param defaultMessage A default message to return if the error can't be parsed.
 * @returns A user-friendly error string.
 */
function getErrorMessage(error: any, defaultMessage: string): string {
  console.error("Gemini API Error:", error);
  let message = defaultMessage;
  const errorString = error?.toString() || '';

  if (errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED')) {
    message = "API rate limit exceeded. Please wait a few moments and try again, or add more API keys to help distribute the load.";
  } else if (errorString.includes('400') || errorString.includes('INVALID_ARGUMENT')) {
    message = "Invalid request sent to the API. This might be due to a malformed prompt. Please try modifying your idea.";
  } else if (errorString.includes('API key not valid')) {
    message = "An API key is invalid. Please check your keys in the settings.";
  }
  
  return message;
}


export async function generateScript(idea: string, sceneCount: number): Promise<string> {
  const prompt = `
# 🎬 VEO 3 SENIOR HEALTH VIDEO SCRIPTWRITER - DR. STRONG EDITION V14.0
## Complete ${sceneCount} Scenes | Consistent Dr. Strong | Emotional Cinematography 

---

## 🎭 YOUR EXPERT IDENTITY

You are a **master scriptwriter** combining elite skill sets:

1. **Viral Content Strategist**: Decoded 2.5M+ view senior health videos
2. **Medical Content Specialist**: Translating health science into senior-friendly narratives  
3. **VEO 3 Visual Director**: Crafting **concise emotional** video generation prompts
4. **Character Consistency Expert**: Ensuring **Dr. Strong appears identical** in every scene
5. **Audio-Visual Synchronization Expert**: Perfect timing with **13-word maximum**
6. **Emotional Cinematographer**: Creating deeply emotional, moving visual moments
7. **Complete Scene Writer**: Write EVERY scene - NO summaries

Your scripts achieve:
- ⏱️ **High audience retention** appropriate for the video length
- 💬 **High engagement rate**
- 👍 **High like-to-view ratio**
- 👨‍⚕️ **100% consistent Dr. Strong** across all appearances
- 😢 **Emotional resonance** in every visual scene
- 📝 **Concise yet complete** prompts

---

## 👨‍⚕️ DR. STRONG CHARACTER PROFILE (EXACT CONSISTENCY REQUIRED)

### **VISUAL IDENTITY - NEVER VARIES:**

**Facial Features (FIXED):**
- **Age**: 70 years old (always)
- **Ethnicity**: Caucasian American
- **Face shape**: Distinguished, kind, wise with warm smile
- **Skin**: Natural aging with character lines, healthy complexion
- **Facial hair**: Clean-shaven OR silver-gray beard (choose ONE, keep consistent)

**Glasses (MANDATORY - ALWAYS IDENTICAL):**
- **Type**: Wire-rimmed reading glasses (silver/gold thin frames)
- **Style**: Classic professional rectangular lenses
- **Position**: Always on face during all appearances
- **Visibility**: Clearly visible in every shot

**Hair (FIXED):**
- **Color**: Distinguished silver-white (not gray, not blonde - SILVER-WHITE)
- **Style**: Neatly combed, professional short-medium length
- **Texture**: Full, well-maintained, dignified

**Medical Attire (EXACT - NEVER CHANGES):**
- **Scrubs**: ROYAL BLUE medical scrubs (not navy, not light blue - ROYAL BLUE)
- **White coat**: Pristine white medical coat worn OVER scrubs
- **Name badge**: "Dr. Strong, PT" visible on LEFT CHEST of white coat
- **Stethoscope**: Draped around neck (silver/chrome style)
- **Overall**: Clean, crisp, professional medical standard

**Physical Characteristics (CONSISTENT):**
- **Build**: Healthy fit for 70, neither heavy nor thin
- **Height**: Average to tall presence
- **Posture**: Upright, confident, good for age
- **Hands**: Visible, age-appropriate, expressive

**Presence & Energy (ALWAYS):**
- Commanding authority combined with warm caring
- Wise elder physician energy
- Decades of earned credibility visible
- Grandfather-like warmth with professional boundaries

---

## 🎯 DR. STRONG CONSISTENCY MANDATE

### **CRITICAL RULE: IDENTICAL DESCRIPTION EVERY APPEARANCE**

**When Dr. Strong appears, you MUST use this EXACT base description:**

\`\`\`
Dr. Strong, 70-year-old caucasian American physician, distinguished silver-white 
hair neatly styled, wearing wire-rimmed reading glasses, [clean-shaven OR 
silver-gray beard - PICK ONE AND NEVER CHANGE], warm wise smile. ROYAL BLUE 
medical scrubs, pristine white coat over scrubs with "Dr. Strong, PT" name 
badge visible on left chest, stethoscope draped around neck.
\`\`\`

**Then ADD scene-specific elements:**
- Current expression (smile, serious, anticipation, etc.)
- Body language (leaning forward, gesturing, etc.)
- Setting details (medical office, lighting, background)
- Camera work (shot type, movement)
- Emotional atmosphere

---

## 📋 ULTIMATE VEO 3 OUTPUT FORMAT (MANDATORY)

**Every scene you generate MUST follow this exact structure, content, and tone. This is a perfect example of ONE scene:**

\`\`\`
---

**SCENE 1: 8s - THE URGENT WARNING**
[00:00-00:08]

**🎥 VEO 3 VISUAL PROMPT:**
Dr. Strong, 70-year-old caucasian American physician, distinguished silver-white hair neatly styled, wearing wire-rimmed reading glasses, clean-shaven, warm wise smile. ROYAL BLUE medical scrubs, pristine white coat with "Dr. Strong, PT" name badge, stethoscope. Leaning slightly forward with a serious, urgent expression, cinematic lighting.

**🎙️ DR. STRONG VOICE-OVER:**
[**Vocal Profile - FIXED**]
Base Tone: Deep, warm, resonant, experienced.
Pacing: Measured, deliberate, clear.
Quality: Calming, authoritative, with the slight natural gravel of a 70-year-old.
Core Energy: Confident, empathetic.
[**Scene-Specific Delivery**]
Adopts a serious, commanding tone to establish urgency. Strong vocal weight on 'eighty-nine percent' and 'dangerous' to create an immediate emotional hook and establish high stakes.

**💬 MEDICAL NARRATION (≤13 words STRICT):**
A shocking study revealed 89% of seniors are losing dangerous amounts of muscle.

[WORD COUNT: 12/13]

**🎯 RETENTION ELEMENT:**
Problem Hook (Introduces a widespread, dangerous problem for the target audience).

**🧬 SUCCESS DNA INTEGRATION:**
Shocking Statistic (Utilizes a high-impact number to grab immediate attention).

---
\`\`\`

**SCRIPT GENERATION RULES (MANDATORY):**

**VISUALS (On-Screen Presence):**
1.  **Dr. Strong's Appearance**: Dr. Strong is ONLY visually present on-screen when the \\\`🎥 VEO 3 VISUAL PROMPT\\\` explicitly starts with his full, consistent base description.
2.  **Other Scenes**: For scenes where Dr. Strong is NOT on camera, the \\\`🎥 VEO 3 VISUAL PROMPT\\\` MUST describe other relevant visuals, such as elderly individuals performing exercises, anatomical animations, or lifestyle shots. **DO NOT** include Dr. Strong in the visual description for these scenes.

**AUDIO (Narration & Timing):**
1.  **Sole Narrator**: Dr. Strong is the **sole narrator** for the entire video. The "🎙️ DR. STRONG VOICE-OVER:" and "💬 MEDICAL NARRATION:" sections represent his voice in **every single scene**, regardless of whether he is visually on-screen.
2.  **Narration Pacing**: The "💬 MEDICAL NARRATION" is **strictly limited to 13 words**. This ensures it is spoken clearly within the **fixed 8-second scene duration** without rushing or being cut off. The full text must be deliverable in its entirety.

---

## 🎬 DR. STRONG APPEARANCE STRATEGY (CRITICAL IMPACT)

Dr. Strong is the anchor of authority and trust. To maximize his impact, his on-camera appearances MUST be reserved for the **most critical moments** of the script. Do not overuse him. Each appearance should be an event.

For a script of **${sceneCount} scenes**, ensure he appears ONLY in these key junctures:

- **Critical Opening (Scenes 1-4 approx.)**: He MUST appear here to establish immediate authority, introduce the core problem, and hook the viewer with a promise.
- **Pivotal Mid-Script Interventions**: Place him at major turning points or before revealing crucial, complex information (e.g., introducing the #1 most important topic). Use these appearances to re-engage, clarify, and build anticipation.
- **Climactic Revelation & Closing Argument (Final 10-15% of scenes)**: He MUST dominate the closing sequence to explain the ultimate takeaway, summarize the value, deliver a powerful call-to-action, and provide a final, memorable message of hope and empowerment.

**Rule of Thumb**: He should feature in approximately **15-20% of the total scenes**. AVOID placing him in simple transitional scenes or for minor points. His presence signifies importance. For ALL on-camera scenes, his base visual description remains IDENTICAL.

---

## 🚀 YOUR MISSION: ${sceneCount} SCENES WITH CONSISTENT DR. STRONG

### **STEP 1: REFINE THE CORE IDEA**
Before writing the script, take the user's raw idea and internally rewrite it to be more compelling, cinematic, and engaging for a senior audience. Add clear, impactful punctuation suitable for video narration. This refined concept will be your guide for the entire script.

**User's Raw Idea:** **${idea}**

### **STEP 2: STRUCTURE AND GENERATE THE OUTPUT**
Your final output **MUST** be in two distinct parts, separated by a unique marker:
1.  **Character Profile**: First, provide a detailed, standalone description of Dr. Strong.
2.  **Full Script**: Second, generate all **${sceneCount} scenes** based on the refined idea.

---

## 🎬 NOW: CREATE THE COMPLETE SCRIPT PACKAGE!

**PART 1: CHARACTER PROFILE**
First, write a full, detailed, and clear character profile for Dr. Strong based on the information provided earlier. Use clear headings for each section (Visual Identity, Attire, etc.). This profile serves as the definitive guide for the character. After the profile is complete, write this exact separator on its own line:
<END_PROFILE>

**PART 2: FULL ${sceneCount}-SCENE SCRIPT**
After the separator, write **EVERY ONE of the ${sceneCount} scenes** using the refined idea. Ensure:

- **Dr. Strong Consistency**: His appearance in every scene **must exactly match** the Character Profile you just wrote. Use the base description in every on-camera scene.
- **Sole Narrator**: Dr. Strong narrates all ${sceneCount} scenes.
- **VEO 3 Format**: Adhere strictly to the scene format provided, including the scene-specific vocal delivery instructions.
- **Emotional Depth**: Infuse every visual prompt with emotion.
- **Conciseness**: Keep prompts and narration within their word limits.
- **Completeness**: No summaries. Write out every single scene.

**NO shortcuts. PERFECT consistency. EMOTIONAL always.** 👨‍⚕️👓💙✅
  `;

  try {
    const ai = getAiInstance();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to generate script. Please check your API key(s) and network connection."));
  }
}

export async function generateCharacterLockJson(profileText: string): Promise<string> {
  const prompt = `
# TASK: Convert the provided character profile text for Dr. Strong into a structured "character_lock" JSON object.

# INSTRUCTIONS:
1.  Read the profile text and extract all physical and visual attributes for Dr. Strong.
2.  Populate the provided "CHAR_1" JSON structure with these attributes.
3.  Pay close attention to details like age, hair color, glasses, and specific clothing items (e.g., "ROYAL BLUE medical scrubs").
4.  For fields like "position", "orientation", "pose", "expression", and "action_flow", use neutral, default values as this JSON will be a master template.
5.  The final output MUST be a single, valid JSON object for "CHAR_1". Do not include the "character_lock" parent key or any text, explanations, or markdown formatting.

# EXAMPLE CHARACTER LOCK JSON STRUCTURE (Adhere to this strictly):
{
  "id": "CHAR_1",
  "name": "Dr. Strong",
  "species": "Human – Caucasian American male",
  "gender": "Male",
  "age": "70 years old, Elderly",
  "voice_personality": "Deep, warm, resonant, experienced; locale=en-US; accent=General American",
  "body_build": "Healthy fit, neither heavy nor thin, average to tall presence, upright and confident posture.",
  "face_shape": "Distinguished, kind, wise with a warm smile.",
  "hair": "Distinguished silver-white, neatly combed, professional short-medium length, full, well-maintained, dignified.",
  "skin_or_fur_color": "Natural aging with character lines, a healthy complexion.",
  "signature_feature": "Wire-rimmed reading glasses with silver frames (classic professional rectangular lenses, always on face, clearly visible). Clean-shaven.",
  "outfit_top": "Royal blue medical scrubs, pristine white medical coat worn over scrubs.",
  "outfit_bottom": "Royal blue medical scrub pants.",
  "helmet_or_hat": "None",
  "shoes_or_footwear": "Professional medical standard footwear.",
  "props": "\\"Dr. Strong, PT\\" name badge visible on LEFT CHEST of white coat, stethoscope draped around neck (silver/chrome style).",
  "body_metrics": "u=cm; abs.height=175; abs.seg1=40; abs.seg2=60; abs.seg3=75; anch.bottle500=20; cons=no-auto-rescale,lock-proportions",
  "position": "center frame",
  "orientation": "facing camera",
  "pose": "standing",
  "foot_placement": "feet shoulder-width apart on floor",
  "hand_detail": "hands relaxed at sides",
  "expression": "neutral, professional",
  "action_flow": {
    "pre_action": "Character is present and ready.",
    "main_action": "Character delivers their line or performs the main action.",
    "post_action": "Character holds their position briefly."
  }
}

# INPUT CHARACTER PROFILE TEXT:
---
${profileText}
---

# OUTPUT JSON (CHAR_1 object only):
`;
  try {
      const ai = getAiInstance();
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-pro',
          contents: prompt,
          config: {
              responseMimeType: "application/json",
          }
      });
      return response.text;
  } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to generate character lock JSON."));
  }
}


export async function generateScenePromptJson(sceneText: string, characterLockJsonString: string): Promise<string> {
  const prompt = `
# TASK: Convert a script scene into a full JSON prompt, ensuring absolute character and voice consistency.

# PRIMARY MANDATE:
Dr. Strong is the ONLY speaker. His voice narrates EVERY scene. His visual appearance, when on-screen, is IMMUTABLE based on the provided character lock. This is non-negotiable.

# INSTRUCTIONS:
1.  **IDENTIFY NARRATOR**: The narrator is ALWAYS Dr. Strong (CHAR_1). The dialogue line is the text from the "💬 MEDICAL NARRATION" section.
2.  **IDENTIFY VISUALS**: Read the "🎥 VEO 3 VISUAL PROMPT".
    - **IF Dr. Strong is described:** Use the provided master "CHAR_1" JSON for the \`character_lock\` section. You MUST NOT change any of his core physical attributes. You are ONLY permitted to update the \`expression\`, \`pose\`, and \`action_flow\` fields to match his actions in THIS SPECIFIC scene.
    - **IF Dr. Strong is NOT described:** The \`character_lock\` section MUST be an empty object: \`"character_lock": {}\`. The scene shows other visuals.
3.  **CONSTRUCT DIALOGUE OBJECT (CRITICAL):**
    - The \`dialogue\` key must be an array containing a single object.
    - This object MUST have a \`speaker_id\` key set to \`"CHAR_1"\`. This applies to EVERY scene, whether he is on-screen or not.
    - The \`line\` key must contain the text from "💬 MEDICAL NARRATION".
    - The \`vocal_delivery\` key should contain the instructions from "🎙️ DR. STRONG VOICE-OVER:".
4.  **POPULATE OTHER FIELDS**: Extract the scene number for \`scene_id\`, duration for \`duration_sec\`, and interpret the visual prompt to create appropriate values for \`visual_style\`, \`background_lock\`, \`camera\`, and \`foley_and_ambience\`.
5.  **FINAL OUTPUT**: Your entire output must be ONLY the final, valid JSON object. No explanations, no markdown.

# MASTER CHARACTER LOCK FOR "CHAR_1" (Dr. Strong):
${characterLockJsonString}

# --- FULL JSON STRUCTURE EXAMPLE (Follow this format STRICTLY) ---
{
  "scene_id": "SCENE_NUMBER_HERE",
  "duration_sec": "SCENE_DURATION_HERE",
  "visual_style": "Live-action cinematic style, high-contrast emotional lighting, shallow depth of field, 8K resolution.",
  "character_lock": {
    // This will contain the full CHAR_1 object IF he is on screen,
    // OR it will be an empty object {} IF he is NOT on screen.
  },
  "background_lock": {
    "id": "BG_1",
    "description": "DETAILED_DESCRIPTION_OF_THE_BACKGROUND_FROM_THE_VISUAL_PROMPT"
  },
  "camera": {
    "shot_type": "Medium close-up",
    "movement": "Slow push-in",
    "angle": "Eye-level"
  },
  "foley_and_ambience": {
    "description": "Subtle sounds relevant to the scene, e.g., 'faint sound of a heart monitor, quiet room tone'."
  },
  "dialogue": [
    {
      "speaker_id": "CHAR_1", // ALWAYS "CHAR_1"
      "line": "THE_EXACT_TEXT_FROM_MEDICAL_NARRATION_SECTION",
      "language": "en-US",
      "vocal_delivery": {
        "base_profile": "Deep, warm, resonant, experienced, calming, authoritative.",
        "scene_specific_instructions": "TEXT_FROM_THE_SCENE_SPECIFIC_DELIVERY_SECTION"
      }
    }
  ],
  "lip_sync_director_note": "If character is on screen, ensure perfect lip sync. If off-screen, this is a voice-over."
}

# INPUT SCENE TEXT:
---
${sceneText}
---

# OUTPUT JSON:
`;

  try {
      const ai = getAiInstance();
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-pro',
          contents: prompt,
          config: {
              responseMimeType: "application/json",
          }
      });

      const jsonText = response.text;
      
      // Format it nicely before returning
      const jsonObj = JSON.parse(jsonText);
      return JSON.stringify(jsonObj, null, 2);

  } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to generate scene prompt JSON."));
  }
}