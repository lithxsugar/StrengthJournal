import { Timestamp } from './firebase';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
}

export interface JournalEntry {
  id?: string;
  userId: string;
  date: Timestamp;
  action: string;
  time?: string;
  place?: string;
  obstacles?: string;
  opportunities?: string;
  strengths: string[]; // Changed from strength: string
  createdAt: Timestamp;
}

export interface Quote {
  text: string;
  author: string;
}

export const VIRTUES: { [key: string]: string[] } = {
  "Wisdom": ["Creativity", "Curiosity", "Open-mindedness/judgement", "Love of Learning", "Perspective"],
  "Courage": ["Bravery", "Persistence/perseverence", "Zest"],
  "Humanity": ["Love", "Kindness", "Social Intelligence"],
  "Justice": ["Teamwork", "Fairness", "Leadership"],
  "Temperance": ["Forgiveness", "Modesty/humility", "Prudence", "Self-regulation"],
  "Transcendence": ["Appreciation of beauty and excellence", "Gratitude", "Hope", "Humor", "Religiousness/spirituality"]
};

export const CHARACTER_STRENGTHS_DATA: { [key: string]: string } = {
  "Teamwork": "Working well as a member of a group or team; being loyal to the group; doing one's share.",
  "Kindness": "Doing favors and good deeds for others; helping them; taking care of them.",
  "Hope": "Expecting the best in the future and working to achieve it; believing that a good future is something that can be brought about.",
  "Perspective": "Being able to provide wise counsel to others; having ways of looking at the world that make sense to oneself and to other people.",
  "Religiousness/spirituality": "Having coherent beliefs about the higher purpose and meaning of the universe; knowing where one fits within the larger scheme.",
  "Creativity": "Thinking of novel and productive ways to conceptualize and do things; includes artistic achievement but is not limited to it.",
  "Gratitude": "Being aware of and thankful for the good things that happen; taking time to express thanks.",
  "Persistence/perseverence": "Finishing what one starts; persisting in a course of action in spite of obstacles; 'getting it out the door'; taking pleasure in completing tasks.",
  "Open-mindedness/judgement": "Thinking things through and examining them from all sides; not jumping to conclusions; being able to change one's mind in light of evidence; weighing all evidence fairly.",
  "Forgiveness": "Forgiving those who have done wrong; accepting the shortcomings of others; giving people a second chance; not being vengeful.",
  "Appreciation of beauty and excellence": "Noticing and appreciating beauty, excellence, and/or skilled performance in various domains of life, from nature to art to mathematics to science to everyday experience.",
  "Leadership": "Encouraging a group of which one is a member to get things done and at the same time maintain good relations within the group; organizing group activities and seeing that they happen.",
  "Love of learning": "Mastering new skills, topics, and bodies of knowledge, whether on one's own or formally; obviously related to the strength of curiosity but goes beyond it to describe the tendency to add systematically to what one knows.",
  "Fairness": "Treating all people the same according to notions of fairness and justice; not letting personal feelings bias decisions about others; giving everyone a fair chance.",
  "Curiosity": "Taking an interest in ongoing experience for its own sake; finding subjects and topics fascinating; exploring and discovering.",
  "Bravery": "Not shrinking from threat, challenge, difficulty, or pain; speaking up for what is right even if there is opposition; acting on convictions even if unpopular; includes physical bravery but is not limited to it.",
  "Zest": "Approaching life with excitement and energy; not doing things halfway or halfheartedly; living life as an adventure; feeling alive and activated.",
  "Humor": "Liking to laugh and tease; bringing smiles to other people; seeing the light side; making (not necessarily telling) jokes.",
  "Modesty/humility": "Letting one's accomplishments speak for themselves; not seeking the spotlight; not regarding oneself as more special than one is.",
  "Social Intelligence": "Being aware of the motives and feelings of other people and oneself; knowing what to do to fit into different social situations; knowing what makes other people tick.",
  "Self-regulation": "Regulating what one feels and does; being disciplined; controlling one's appetites and emotions.",
  "Prudence": "Being careful about one's choices; not taking undue risks; not saying or doing things that might later be regretted.",
  "Love": "Valuing close relations with others, in particular those in which sharing and caring are reciprocated; being close to people."
};

export const CHARACTER_STRENGTHS = Object.keys(CHARACTER_STRENGTHS_DATA);
