const BLURBS = {
  "ISTJ": [
    "You tend to take your bearings from what has already been proved in practice, and you like a day that can be planned. Careful records, clear duties and a finish line you can see will usually suit you better than a loose brief.",
    "You may be quieter in a room than some colleagues, and firmer about standards. That combination can look unadventurous to people who like to start from a blank page. It is often a preference for evidence over novelty, not a lack of thought.",
    "If this reading is close, the Big Five assessment will show in more detail how order, caution and sociability actually sit for you, rather than leaving the work to four letters alone."
  ],
  "ISFJ": [
    "You tend to notice what other people need, and you like to meet those needs in a steady, practical way. Familiar methods and a kept promise will usually matter more to you than a new theory.",
    "You may not seek the front of the room, and you may hold yourself to a high standard of care. That can be taken for shyness, or for a willingness to carry more than your share. It is often a preference for loyalty and concreteness.",
    "The Big Five assessment will show the same ground with more resolution: how warm, how organised, and how reserved you actually are, trait by trait."
  ],
  "INFJ": [
    "You tend to look for the pattern underneath a situation, and you weigh decisions against their effect on people. A clear inner picture of what ought to happen can matter as much to you as the visible facts of the day.",
    "You may keep a lot of that picture private until it is ready, and you may be firm once it is. That can be read as distance, or as certainty you have not explained. It is often a preference for meaning and for a future you can stand behind.",
    "The Big Five assessment is the better place to see how that mix of ideas, feeling and structure actually comes out in your scores."
  ],
  "INTJ": [
    "You tend to start from a model of how things could work, then prune it until it is coherent. Independent judgement and a long view will usually count for more than consensus in the moment.",
    "You may have little patience for loose process, and you may say so plainly. That can be taken for coldness. It is often a preference for conceptual order, and for time alone to think, rather than a lack of regard for people.",
    "If you want the more detailed map — including how organised, how curious and how reserved you are — take the Big Five assessment next."
  ],
  "ISTP": [
    "You tend to understand a thing by handling it, and you like to keep your options open until the facts are in. Calm troubleshooting usually suits you better than a long meeting about principles.",
    "You may be economical with words, and restless when a procedure exists only on paper. That can look like detachment. It is often a preference for skill, proof and flexibility.",
    "The Big Five assessment will separate those strands — curiosity, reserve, and a lighter hold on plans — more clearly than a four-letter label can."
  ],
  "ISFP": [
    "You tend to judge a situation by what it feels like to the people in it, and you prefer to respond to what is in front of you rather than force it into a plan too early. Quiet loyalty and a practical kindness will often show before a speech does.",
    "You may resist being hurried into a system that leaves no room for the particular case. That can be read as indecision. It is often a preference for values lived out, not announced.",
    "The Big Five assessment will show that mix of warmth, flexibility and reserve in a form this practice can actually work with."
  ],
  "INFP": [
    "You tend to measure a decision against an inner standard of what is right, and you are drawn to ideas that give life a shape. The work that fits is usually work you can believe in, not only work you can finish.",
    "You may need time alone to think, and you may dislike being pushed to close a question before you have found the honest answer. That can be taken for vagueness. It is often a preference for meaning over speed.",
    "The Big Five assessment will show, more plainly than four letters can, how that inner standard sits alongside your actual habits of organisation and sociability."
  ],
  "INTP": [
    "You tend to take ideas apart to see whether they hold, and you are more interested in an accurate account than in a tidy one. A question left slightly open can feel more honest to you than a conclusion reached too soon.",
    "You may be quiet in the room and sharp on the point. That combination can be read as scepticism for its own sake. It is often a preference for analysis, and for time to think without an audience.",
    "If this sounds close, the Big Five assessment will show the same pattern in trait scores, including the fifth trait that this short profile does not attempt to measure."
  ],
  "ESTP": [
    "You tend to read the room as it is, act, and adjust. Immediate problems, practical levers and a bit of pressure will usually interest you more than a long theoretical brief.",
    "You may grow impatient with procedure that does not change the situation in front of you. That can look like restlessness, or like a lack of planning. It is often a preference for what works now, tested in practice.",
    "The Big Five assessment will show how that action-first style sits with your actual levels of sociability, curiosity and organisation."
  ],
  "ESFP": [
    "You tend to bring energy into a room and to notice what will help people feel at ease in the present moment. A lived experience usually teaches you faster than a manual does.",
    "You may put off a rigid plan if the day has something more alive in it. That can be taken for a lack of seriousness. It is often a preference for people, and for responding to what is actually happening.",
    "The Big Five assessment is the next step if you want that reading in a fuller, trait-by-trait form."
  ],
  "ENFP": [
    "You tend to see possibilities quickly, and you are energised by people and by ideas that have not yet been tried. A new connection or a fresh angle can matter as much to you as a finished plan.",
    "You may resist being closed into one method too early, and you may feel boxed in by routine. That can look like a lack of follow-through. It is often a preference for exploration, which still needs a way to land.",
    "The Big Five assessment will show how strong those pulls actually are — toward people, toward ideas, and toward (or away from) structure."
  ],
  "ENTP": [
    "You tend to test an idea by turning it over, often out loud, and you are quick to see a counter-argument. Debate, for you, is usually a way of getting closer to a better account, not a way of scoring points.",
    "You may be restless with settled procedure and impatient when a discussion is closed too soon. That can be taken for contrariness. It is often a preference for invention and for argument as a form of thought.",
    "The Big Five assessment will give the more detailed picture of that curiosity, that social energy, and how far structure actually holds you."
  ],
  "ESTJ": [
    "You tend to organise people and work toward a clear standard, and you like decisions that can be executed. A plan with owners, dates and a way to check the result will usually suit you better than an open-ended discussion.",
    "You may be direct, and you may have little patience for vagueness. That can be read as severity. It is often a preference for order and for responsibility that can be named.",
    "If this reading is close, take the Big Five assessment next. It will show the same ground with more precision, including where firmness and sociability actually sit."
  ],
  "ESFJ": [
    "You tend to keep a group running by noticing what people need and by putting a reliable structure around it. Loyalty, hospitality and a kept schedule will often matter as much to you as the official task.",
    "You may take it personally when a standard of care is missed, and you may work hard to hold a team together. That can be taken for over-involvement. It is often a preference for people and for order in the service of people.",
    "The Big Five assessment will show that combination more clearly, trait by trait, than a four-letter type can."
  ],
  "ENFJ": [
    "You tend to lead with a picture of what a group could become, and you take other people’s development as part of the work. A decision is rarely only a technical one for you; it is also a question of what it does to the room.",
    "You may carry more of the emotional labour than you advertise, and you may be firm about the direction once it is set. That can be read as intensity. It is often a preference for people, for meaning, and for a plan that can be shared.",
    "The Big Five assessment is the fuller reading this practice uses, and it will show those strengths — and their costs — with more resolution."
  ],
  "ENTJ": [
    "You tend to set direction, organise the work, and move a group toward a decision. A long view and a willingness to cut what is not working will usually matter more to you than keeping every option open.",
    "You may be blunt when a plan is weak, and you may grow impatient with process that does not change the outcome. That can be taken for dominance. It is often a preference for leadership as a form of responsibility, not only as a form of visibility.",
    "If you want the more detailed map of that drive — including how you actually score on organisation, sociability and the other traits — take the Big Five assessment on big5.drelijah.org."
  ]
};
if (typeof module !== 'undefined') module.exports = { BLURBS };
