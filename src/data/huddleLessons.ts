export interface LessonContent {
  id: string;
  title: string;
  description: string;
  readTime: string;
  content: string[];
  keyTakeaways: string[];
}

export interface ModuleData {
  title: string;
  description: string;
  lessons: LessonContent[];
}

export const MODULES: ModuleData[] = [
  {
    title: "Module 1: Freshman Year — Laying the Foundation",
    description: "Start your recruiting journey the right way from day one.",
    lessons: [
      {
        id: "1-1",
        title: "Understanding the College Golf Landscape",
        description: "NCAA divisions, NAIA, JUCO — what's right for you",
        readTime: "5 min read",
        content: [
          "The college golf landscape is more diverse than most families realize. There are over 1,800 college golf programs across the United States, spanning five major governing bodies: NCAA Division I, NCAA Division II, NCAA Division III, NAIA, and JUCO (junior colleges). Each offers a different experience in terms of competitiveness, scholarship availability, academic rigor, and lifestyle.",
          "NCAA Division I is the most competitive level. These programs recruit nationally and internationally, often requiring scoring averages in the low-to-mid 70s. D1 programs offer up to 4.5 men's scholarships and 6 women's scholarships, which are typically divided among 8–12 roster players. The competition for roster spots and playing time is fierce.",
          "NCAA Division II offers a strong balance between athletics and academics. Scholarships are available (same limits as D1), and the competition level is high but slightly more accessible. Many D2 programs compete in beautiful facilities and provide excellent coaching. This is often the 'sweet spot' for talented players who want meaningful playing time.",
          "NCAA Division III does not offer athletic scholarships, but don't overlook these programs. Many D3 schools offer generous academic and need-based financial aid packages that can rival athletic scholarships. D3 golf can be highly competitive, and the emphasis on the student-athlete experience is genuine.",
          "NAIA schools operate independently from the NCAA and can offer up to 5 scholarships for golf. NAIA programs tend to be smaller schools with strong communities. The recruiting rules are more relaxed, and coaches can contact you earlier in the process.",
          "JUCO (junior college) programs are two-year schools that serve as excellent stepping stones. If your grades, test scores, or golf game need development, a JUCO program lets you mature as a player and student before transferring to a four-year school. Many successful college and professional golfers started at JUCOs.",
          "As a freshman, your goal is simply to understand these options and begin thinking about which level matches your current ability, academic profile, and personal preferences. There's no pressure to decide now — but awareness sets you up for smarter decisions later."
        ],
        keyTakeaways: [
          "There are 5 main levels of college golf: D1, D2, D3, NAIA, and JUCO",
          "D1 and D2 offer athletic scholarships; D3 offers academic/need-based aid only",
          "JUCO is a valid and strategic pathway to four-year programs",
          "Your freshman year is about awareness, not decisions"
        ]
      },
      {
        id: "1-2",
        title: "Setting Your Recruiting Goals Early",
        description: "How to create a realistic timeline and target list",
        readTime: "5 min read",
        content: [
          "Setting recruiting goals as a freshman might seem premature, but the families who start early gain a significant advantage. You're not committing to anything — you're simply creating a framework that will guide your decisions over the next three years.",
          "Start with an honest self-assessment. What is your current scoring average over your last 10–20 competitive rounds? What's your handicap index? Where do you rank among your peers locally, regionally, and nationally? These numbers establish your baseline and help you identify which division of college golf is realistic today — and what you need to improve to reach your target level.",
          "Next, define your 'ideal' college experience beyond golf. Consider factors like geographic preference (close to home or willing to go anywhere?), school size (small liberal arts or large university?), academic programs of interest, campus culture, and climate. Golf is important, but you'll spend far more time in the classroom and on campus than on the course.",
          "Create a preliminary target list of 20–30 schools. Don't worry about narrowing it down yet. Use the College Fairway Advisors database to research programs by division, state, conference, and scoring averages. Include a mix of 'reach' schools (programs where you'd need significant improvement), 'match' schools (programs that fit your current level), and 'safety' schools (programs where you'd be a strong addition).",
          "Set measurable goals for each year. For freshman year, these might include: achieve a specific handicap index, play in a certain number of qualifying tournaments, maintain a target GPA, and register with the NCAA Eligibility Center. Write these down and review them quarterly.",
          "Finally, involve your parents or guardians in this process. Recruiting is a family decision that involves financial planning, travel logistics, and emotional support. The more aligned everyone is from the beginning, the smoother the journey will be."
        ],
        keyTakeaways: [
          "Conduct an honest self-assessment of your game, grades, and goals",
          "Build a preliminary list of 20–30 schools across reach, match, and safety tiers",
          "Set measurable annual goals for golf, academics, and recruiting milestones",
          "Involve your family early — recruiting is a team effort"
        ]
      },
      {
        id: "1-3",
        title: "Building Your Academic Foundation",
        description: "GPA, test prep, and NCAA Eligibility Center registration",
        readTime: "5 min read",
        content: [
          "Your academic record is just as important as your golf game in the recruiting process — and in many cases, it's more important. College coaches want players who will be eligible, stay eligible, and represent their program well in the classroom. A strong GPA opens doors; a weak one closes them.",
          "The NCAA Eligibility Center (formerly the Clearinghouse) is the first step for any student-athlete considering D1 or D2 programs. You should register at the beginning of your freshman year at eligibilitycenter.org. Registration is free initially, and the certification fee ($90 as of 2024) can be paid later. Early registration ensures your transcripts are tracked from day one.",
          "The NCAA requires completion of 16 core courses for D1 and D2 eligibility. These include 4 years of English, 3 years of math (Algebra 1 or higher), 2 years of natural/physical science, 1 year of additional English/math/science, 2 years of social science, and 4 years of additional core courses. Plan your schedule carefully — not all courses at your school may qualify as 'core courses.'",
          "For D1, you need a minimum core GPA of 2.3 paired with specific SAT/ACT scores on a sliding scale. A higher GPA requires lower test scores, and vice versa. For D2, the minimum core GPA is 2.2 with corresponding test scores. D3 and NAIA have their own academic standards set by individual schools.",
          "GPA management starts now. Every grade you earn from freshman year forward counts toward your core GPA. A bad semester freshman year can haunt you through senior year. If you're struggling in a class, get help immediately — tutoring, study groups, and teacher office hours are your best resources.",
          "Standardized test preparation should begin no later than sophomore year. The PSAT (taken in October of sophomore or junior year) qualifies you for National Merit Scholarships and serves as excellent practice. Plan to take the SAT or ACT for the first time in the spring of your sophomore year, giving you multiple attempts to improve before scores are needed for recruiting conversations.",
          "Consider taking AP or honors courses if they're available and manageable. These courses demonstrate academic rigor to college admissions committees and can earn college credit, potentially saving thousands of dollars. However, don't sacrifice your GPA by overloading — a 3.8 in regular courses is generally better than a 3.2 in all AP courses for athletic recruiting purposes."
        ],
        keyTakeaways: [
          "Register with the NCAA Eligibility Center at the start of freshman year",
          "Plan your course schedule to meet the 16 core course requirements",
          "Every grade from freshman year counts — protect your GPA from day one",
          "Start SAT/ACT prep by sophomore year and plan multiple test attempts"
        ]
      },
      {
        id: "1-4",
        title: "Developing Your Competitive Resume",
        description: "Tournaments to play and stats to track from year one",
        readTime: "5 min read",
        content: [
          "College coaches evaluate recruits primarily through competitive results. Your tournament resume tells a story — it shows consistency, improvement trajectory, ability to perform under pressure, and the level of competition you've faced. Building this resume starts freshman year.",
          "Play in as many competitive tournaments as possible. Local and regional junior golf tours (AJGA, US Kids, Hurricane Junior, PKBGT, etc.) provide the caliber of competition that college coaches respect. High school golf is important for team experience, but coaches place much more weight on your junior tournament results.",
          "Track everything. Create a spreadsheet or use the CFA Tournament Log to record every competitive round: tournament name, course, date, score, relative to par, finish position, and field size. This data becomes invaluable when you create your athlete resume and when coaches ask about your game.",
          "Understand which stats matter most to coaches. Scoring average is the headline number, but coaches also look at: rounds in the 60s (or under par), performance in stroke play vs. match play, consistency (standard deviation of scores), improvement trends over time, and performance against ranked competition.",
          "WAGR (World Amateur Golf Ranking) points are increasingly important, especially for D1 recruiting. Tournaments that offer WAGR points tend to have stronger fields and more visibility. Even if you're not yet competitive at the WAGR level, understanding the system and working toward qualifying for WAGR events should be on your radar.",
          "Don't neglect your short game and course management stats if you can track them. Coaches love seeing greens in regulation percentage, up-and-down percentage, and putts per round. These stats demonstrate that you understand the game beyond just hitting the ball far.",
          "Set a goal to play 15–20 competitive tournament rounds per year minimum. Quality matters more than quantity, but you need enough data points to establish a reliable scoring average. Mix local events with travel tournaments to get exposure to different courses, conditions, and competitors."
        ],
        keyTakeaways: [
          "Junior tour results carry more weight than high school golf for recruiting",
          "Track every competitive round — scores, finishes, field sizes, and course details",
          "Aim for 15–20 competitive tournament rounds per year minimum",
          "Research WAGR-rated events and work toward competing in them"
        ]
      },
    ],
  },
  {
    title: "Module 2: Sophomore Year — Building Visibility",
    description: "Start getting on coaches' radar with strategic actions.",
    lessons: [
      {
        id: "2-1",
        title: "Creating Your Athlete Resume",
        description: "What coaches want to see and how to present it",
        readTime: "6 min read",
        content: [
          "Your athlete resume is the single most important document in your recruiting toolkit. It's typically the first thing a coach sees, and you have about 30 seconds to make an impression. A well-crafted resume can open doors; a sloppy one will close them before you even get a conversation.",
          "Header Section: Include your full name (large, bold), graduation year, high school, city/state, email, phone number, and a professional headshot. Use a clean photo — on the course in golf attire, not a selfie or prom photo. Include your height and weight if you're comfortable sharing.",
          "Golf Statistics: This is the meat of your resume. Lead with your handicap index and scoring average (specify how many rounds). Include your best 18-hole score, tournament wins and top-5 finishes, and your junior golf tour affiliations. If you have a WAGR ranking, feature it prominently. List your most impressive tournament results (3–5) with event names, dates, and finishes.",
          "Academic Information: Include your cumulative GPA (weighted and unweighted), SAT/ACT scores (or expected test dates), class rank if favorable, intended major or areas of academic interest, and any academic honors or AP courses. Coaches need to know you'll be admissible and eligible.",
          "Additional Sections: Include relevant extracurriculars, community service, and leadership positions. These show coaches that you're a well-rounded person who will represent their program positively. If you have a swing video or highlight reel link, include it prominently.",
          "Design Tips: Keep it to one page. Use a clean, professional layout with consistent formatting. Avoid bright colors, clip art, or gimmicky fonts. Your resume should look like it could come from a college admissions office, not a birthday party invitation. Save and send as a PDF to preserve formatting.",
          "Update your resume quarterly as your stats, scores, and achievements change. An outdated resume with last season's scoring average sends the wrong message about your attention to detail."
        ],
        keyTakeaways: [
          "Keep your resume to one page with a professional, clean design",
          "Lead with your golf statistics — handicap, scoring average, and top results",
          "Include academic info — GPA, test scores, and intended major",
          "Update quarterly and always send as a PDF"
        ]
      },
      {
        id: "2-2",
        title: "Your First Highlight Reel",
        description: "Equipment, angles, and editing tips for a standout video",
        readTime: "6 min read",
        content: [
          "A highlight video gives coaches a window into your game that stats alone can't provide. They want to see your swing mechanics, tempo, ball flight, short game touch, and on-course demeanor. A good video can make a coach want to learn more; a bad one (or no video) can leave you overlooked.",
          "Equipment: You don't need professional videography equipment. A modern smartphone on a tripod is perfectly adequate. Use a phone tripod with a remote trigger or ask a parent/friend to film. Shoot in landscape mode (horizontal), never portrait. Ensure good lighting — overcast days often produce better video than harsh sunlight.",
          "What to Film: Capture a full range of shots — driver (face-on and down-the-line), iron shots (both angles), chipping, pitching, bunker shots, and putting. Include some on-course footage showing course management decisions, pre-shot routines, and your demeanor between shots. Coaches want to see the 'whole golfer,' not just a perfect swing on the range.",
          "Camera Angles: For full swings, film from two angles — face-on (directly in front, belt-high) and down-the-line (directly behind, belt-high). Keep the camera still and level. For short game and putting, a slightly elevated angle can work well. Make sure your entire body and the ball flight are visible in every clip.",
          "Editing: Keep your highlight reel to 3–5 minutes maximum. Start with a brief title card showing your name, grad year, handicap, and contact info. Organize clips by shot type (drives, irons, short game, putting). Include your best shots but also show consistency — coaches want to see repeatable swings, not one lucky shot. End with your contact information displayed for 5 seconds.",
          "Distribution: Upload to YouTube (unlisted) or Vimeo and include the link in your athlete resume, email signature, and recruiting profiles. Make sure the link works and the video is accessible without a password. Test it on multiple devices before sending to coaches.",
          "Update your video at least once per year as your game improves. A video from freshman year won't represent your sophomore or junior year swing accurately."
        ],
        keyTakeaways: [
          "A smartphone on a tripod is all you need — shoot in landscape mode",
          "Film both face-on and down-the-line angles for full swings",
          "Keep the final video to 3–5 minutes with a title card and contact info",
          "Upload to YouTube (unlisted) and include the link everywhere"
        ]
      },
      {
        id: "2-3",
        title: "Introduction to Coach Outreach",
        description: "When, how, and who to contact",
        readTime: "6 min read",
        content: [
          "Coach outreach is where recruiting transitions from passive (building your profile) to active (creating relationships). Understanding the rules, timing, and strategy of outreach is essential — and starting sophomore year puts you ahead of most families.",
          "NCAA Contact Rules: The NCAA has strict rules about when coaches can contact recruits. For D1 and D2, coaches cannot initiate contact (calls, texts, emails) until June 15 after your sophomore year. However — and this is the key — there are NO restrictions on when YOU can contact THEM. You can email, call, or write to any coach at any time. This is your window of opportunity.",
          "Who to Contact: Start with the head coach and the assistant coach responsible for recruiting. Most programs list their coaching staff on the athletics department website with email addresses. You can also find contact information through conference websites, golf publications, and the CFA database.",
          "Your First Email: Keep it concise (150–200 words). Introduce yourself with your name, graduation year, high school, and location. Share 2–3 key statistics (handicap, scoring average, GPA). Express genuine interest in their program and mention something specific about the school (academics, conference, facilities). Attach your athlete resume as a PDF and include your highlight video link. Close with a clear call to action: 'I would love the opportunity to learn more about your program.'",
          "Follow-Up Strategy: Don't expect an immediate response. Coaches receive hundreds of recruiting emails. Follow up 2–3 weeks after your initial email if you haven't heard back. Provide an update — a recent tournament result, improved test score, or campus visit plan. Persistence (not pestering) shows genuine interest.",
          "Track Everything: Use the CFA Coach Tracker to log every coach interaction — date, method of contact, what was discussed, and any follow-up needed. Recruiting conversations can span months or years, and having detailed records prevents embarrassing mistakes like sending the same email twice or forgetting a coach's question.",
          "A Word on Tone: Be professional, humble, and genuine. Coaches can spot form letters and inflated egos from a mile away. Show them you've done your homework about their specific program. Authenticity stands out in a sea of generic recruiting emails."
        ],
        keyTakeaways: [
          "YOU can contact coaches anytime — don't wait for them to find you",
          "Keep initial emails to 150–200 words with key stats and your resume attached",
          "Follow up in 2–3 weeks with updates if you don't hear back",
          "Track every interaction using the CFA Coach Tracker"
        ]
      },
      {
        id: "2-4",
        title: "Camps & Showcases Strategy",
        description: "Which events to attend and how to maximize face time",
        readTime: "5 min read",
        content: [
          "College golf camps and showcases are one of the most effective ways to get direct face time with coaches. Unlike tournament results that coaches see on paper, camps let them evaluate you in person — your swing, your attitude, your coachability, and how you interact with peers.",
          "Types of Events: College-run camps are hosted by specific programs (usually 1–2 days) and give you access to that school's coaching staff and facilities. Multi-school showcases bring coaches from many programs to one location. Both have value, but college-run camps provide more concentrated attention from coaches you're targeting.",
          "When to Attend: Most college camps run in the summer (June–July). Start attending camps the summer after your sophomore year. This timing aligns with NCAA contact rules — coaches can begin communicating with you June 15 after sophomore year, making camp a natural setting for initial conversations.",
          "How to Choose: Prioritize camps at schools on your target list. Don't waste time and money attending camps at programs you have no real interest in. Consider geography, division level, and academic fit. Check if the camp includes playing time, instruction, or both — playing time gives coaches more evaluation opportunity.",
          "Preparation: Email the coach 2–3 weeks before camp confirming your attendance and expressing your enthusiasm. Bring copies of your athlete resume to hand to coaches directly. Pack appropriate golf attire (collared shirts, appropriate shorts/pants). Arrive early and stay late.",
          "At the Camp: Be coachable — this is the #1 trait coaches evaluate at camps. Listen actively, implement feedback immediately, and ask thoughtful questions. Show effort on every shot, even when you think no one is watching (they are). Be respectful to other campers — coaches notice how you treat peers. Introduce yourself to coaches with a firm handshake and eye contact.",
          "After the Camp: Send a personalized thank-you email within 24 hours. Reference something specific that happened at camp — a drill you learned, advice they gave, or a conversation you had. This follow-up demonstrates maturity and genuine interest."
        ],
        keyTakeaways: [
          "Start attending college camps the summer after sophomore year",
          "Prioritize camps at schools on your target list — quality over quantity",
          "Coachability is the #1 trait coaches evaluate at camps",
          "Send a personalized thank-you email within 24 hours of every camp"
        ]
      },
    ],
  },
  {
    title: "Module 3: Junior Year — Active Recruiting",
    description: "This is the most critical year. Make every move count.",
    lessons: [
      {
        id: "3-1",
        title: "Mastering Coach Communication",
        description: "Email sequences, phone calls, and building relationships",
        readTime: "6 min read",
        content: [
          "Junior year is when recruiting shifts into high gear. The emails and introductions from sophomore year now evolve into deeper conversations, phone calls, and relationship building. How you communicate with coaches during this critical year can make or break your recruiting outcome.",
          "Email Communication: By junior year, your emails should feel more like conversations than introductions. Provide regular updates (monthly is ideal): tournament results, academic achievements, video updates, and visit plans. Always personalize each email — coaches can tell when they're receiving a mass email. Reference previous conversations or their recent team results to show you're following their program.",
          "Phone Calls: After June 15 of sophomore year, D1 and D2 coaches can call you. When a coach calls, be prepared. Have your notes handy — what you know about their program, questions you want to ask, and your updated stats. Speak clearly and confidently. It's okay to be nervous, but don't let anxiety prevent you from being yourself. If you miss a call, return it within 24 hours.",
          "What to Ask Coaches: 'What does a typical practice day look like?' 'How do you develop players during the off-season?' 'What's your coaching philosophy for tournament preparation?' 'How many roster spots do you anticipate having for my graduating class?' 'What academic support systems are available for athletes?' These questions show you're serious and thoughtful about your decision.",
          "What NOT to Do: Don't exaggerate your stats or abilities — coaches will find out the truth. Don't badmouth other programs or coaches. Don't let a parent do all the talking on calls (coaches want to evaluate YOU). Don't ghost a coach — if you're no longer interested in a program, tell them professionally. It's a small world.",
          "Building Genuine Relationships: The best recruiting relationships feel natural, not transactional. Share your personality, your goals, and your genuine excitement about their program. Follow the team on social media. Watch their tournament results. Comment on their successes. Coaches recruit people, not just golfers.",
          "Managing Multiple Relationships: You'll likely be communicating with 10–15 coaches actively during junior year. Stay organized with a tracking system. Be honest about your timeline and other schools you're considering — most coaches respect transparency."
        ],
        keyTakeaways: [
          "Send monthly email updates with results, academics, and visit plans",
          "Prepare for phone calls with notes, stats, and thoughtful questions",
          "Never exaggerate stats or badmouth other programs",
          "Be transparent with coaches about your timeline and other schools"
        ]
      },
      {
        id: "3-2",
        title: "Campus Visits Done Right",
        description: "Official vs. unofficial, what to look for, and questions to ask",
        readTime: "7 min read",
        content: [
          "Campus visits are where the recruiting process becomes real. Seeing a campus, meeting the team, and experiencing the culture firsthand provides information that no website, video, or phone call can match. Junior year is prime time for visits.",
          "Unofficial vs. Official Visits: Unofficial visits are arranged and paid for by your family. You can take unlimited unofficial visits at any time. Official visits are paid for by the school (travel, lodging, meals) and you're limited to 5 official visits for D1. You can take official visits starting January 1 of your junior year. Use unofficial visits to explore broadly and save official visits for your top choices.",
          "Planning Your Visit: Contact the coach 3–4 weeks in advance to schedule. Try to visit when the team is on campus and practicing (fall or spring semester, not summer). Request to watch a practice, tour the golf facilities, and meet current players. Ask if you can play a practice round with team members.",
          "What to Evaluate: Facilities (practice facility, home course, weight room, team room). Academics (class sizes, your intended major's department, study hall resources). Campus life (dorms, dining, student activities). Location (proximity to airport, nearby amenities, climate). Team culture (do players seem happy? How do they interact with coaches?). The 'gut feeling' — can you see yourself here for 4 years?",
          "Questions for the Coach: 'Where do you see me fitting on your roster?' 'What's your scholarship offer for me, and how is it structured?' 'How do you handle lineup decisions and qualifying?' 'What does the summer training program look like?' 'What's the team's academic performance and graduation rate?'",
          "Questions for Current Players: 'What do you wish you'd known before committing here?' 'How is the relationship between coaches and players?' 'What's the time commitment during season vs. off-season?' 'How is the academic support for athletes?' 'What do you do for fun around campus?' Players will give you the unfiltered truth that coaches sometimes polish.",
          "After the Visit: Send thank-you notes to the coach, any players who hosted you, and admissions staff you met. In your follow-up email, reference specific things you enjoyed and ask any remaining questions. Discuss the visit with your family while it's fresh — write down pros, cons, and your overall impression.",
          "Use the CFA Campus Visits tracker to rate each school on key criteria and compare your visits side by side. This data becomes invaluable when it's decision time."
        ],
        keyTakeaways: [
          "Use unlimited unofficial visits broadly; save 5 official visits for top choices",
          "Visit when the team is on campus — request to watch practice and meet players",
          "Ask current players the tough questions coaches might polish over",
          "Rate and compare every visit using the CFA Campus Visits tracker"
        ]
      },
      {
        id: "3-3",
        title: "Understanding Scholarship Offers",
        description: "Types of aid, negotiation basics, and comparing packages",
        readTime: "7 min read",
        content: [
          "Scholarship offers are the financial foundation of your college golf career, and understanding them thoroughly can save your family tens of thousands of dollars. Not all offers are equal, and the details matter enormously.",
          "Types of Athletic Scholarships: Full scholarships (covering tuition, room, board, and books) are rare in golf — most programs split their scholarship allotment across multiple players. A typical D1 men's program has 4.5 scholarships divided among 8–12 players. Offers are usually expressed as a percentage: a '50% scholarship' covers half of the total cost. Women's programs have 6 scholarships, which are sometimes more generously distributed.",
          "Beyond Athletic Scholarships: Most college financial aid packages combine multiple sources: athletic scholarships, academic scholarships/merit aid, need-based grants, work-study programs, and loans. The 'net cost' (total cost minus all aid) is the number that matters for your family's budget. Don't focus only on the athletic scholarship amount.",
          "Understanding the Offer Letter: When you receive an offer, get it in writing. The offer should specify the dollar amount or percentage, whether it's renewable annually, what conditions must be met to maintain it (GPA, team participation), and how long it's guaranteed. Ask about cost increases — if tuition rises 4% annually but your scholarship stays flat, your family's out-of-pocket cost increases every year.",
          "Negotiation Basics: Yes, you can negotiate scholarship offers. Approach it professionally: 'I'm very interested in your program, but I've received a more competitive financial package from [other school]. Is there flexibility in your offer?' Have documentation ready. Be honest and respectful. Never fabricate competing offers — coaches talk to each other.",
          "Comparing Offers: Create a standardized comparison spreadsheet. Include total cost of attendance, all forms of aid, net annual cost, 4-year total net cost, and any conditions or restrictions. Use the CFA Scholarship Calculator to run side-by-side comparisons. Consider cost of travel home, off-campus living costs after freshman year, and summer housing availability.",
          "Important Warning: Verbal scholarship offers are NOT binding. Only the National Letter of Intent (NLI) and the financial aid agreement are legally binding documents. A coach can change or withdraw a verbal offer at any time. Don't stop talking to other schools based solely on a verbal offer.",
          "Financial Aid Timeline: Apply for FAFSA (Free Application for Federal Student Aid) starting October 1 of your senior year. Many schools also require the CSS Profile for institutional aid. Complete these forms as early as possible — some aid is first-come, first-served."
        ],
        keyTakeaways: [
          "Focus on 'net cost' — the total after ALL forms of aid, not just athletic scholarships",
          "Get every offer in writing with renewal conditions spelled out",
          "You CAN negotiate — use competing offers professionally and honestly",
          "Verbal offers are NOT binding — only the NLI and financial aid agreement are"
        ]
      },
      {
        id: "3-4",
        title: "Narrowing Your List",
        description: "How to evaluate fit — athletic, academic, social, and financial",
        readTime: "6 min read",
        content: [
          "By the second half of junior year, you should be transitioning from exploring options to making decisions. Narrowing your list from 15–20 schools to 3–5 serious contenders requires honest evaluation across multiple dimensions.",
          "Athletic Fit: Can you compete for playing time in this program? Being the 8th player on a D1 team might mean less playing time than being the 3rd player on a strong D2 team. Consider the program's trajectory — are they improving, stable, or declining? What's the coach's track record of developing players? How does their practice and training philosophy align with your development needs?",
          "Academic Fit: Does the school offer your intended major? What's the academic culture like — collaborative or cutthroat? How does the athletic schedule impact class attendance and academic performance? What's the graduation rate for athletes? Talk to current players about balancing golf and academics at that specific school.",
          "Social & Cultural Fit: Did you feel comfortable on campus during your visit? Could you see yourself making friends outside the golf team? Does the location suit your personality — big city, college town, rural area? Is the campus diverse and inclusive? What's the social scene like — and is it compatible with being a student-athlete?",
          "Financial Fit: What's the true net cost for your family over 4 years? Is the scholarship renewable, and what are the conditions? Are there additional costs your family should plan for (travel, equipment, summer housing)? Would attending this school require taking on significant student loan debt?",
          "The 'What If' Test: Ask yourself — 'If I got injured and could never play golf again, would I still want to attend this school?' If the answer is yes, the school passes the most important test. Your education lasts a lifetime; your golf career may not.",
          "Making the Cut: Rank your remaining schools using a weighted scoring system. Assign importance percentages to each category (e.g., Athletic 30%, Academic 25%, Social 20%, Financial 25%). Score each school 1–10 in each category. The math won't make the decision for you, but it clarifies your priorities and highlights which schools truly align with your goals."
        ],
        keyTakeaways: [
          "Evaluate every school across four dimensions: athletic, academic, social, and financial",
          "Playing time matters — being a contributor on a D2 team may beat sitting on a D1 bench",
          "Apply the 'What If' test: would you attend this school even without golf?",
          "Use a weighted scoring system to objectively compare your final 3–5 schools"
        ]
      },
    ],
  },
  {
    title: "Module 4: Senior Year — Commitment & Transition",
    description: "Close out your recruiting journey and prepare for college golf.",
    lessons: [
      {
        id: "4-1",
        title: "Making Your Decision",
        description: "Verbal commitments, NLI signing, and what happens next",
        readTime: "6 min read",
        content: [
          "The moment of decision is both exciting and nerve-wracking. After years of preparation, evaluation, and relationship building, it's time to commit. Understanding the process and timeline ensures you handle this milestone with confidence and professionalism.",
          "Verbal Commitments: A verbal commitment is a mutual agreement between you and the coach that you intend to attend their school. Verbal commitments can happen at any time and are common before NLI signing day. Important: verbal commitments are NOT binding for either party. The coach can withdraw the offer, and you can change your mind. However, going back on a verbal commitment damages relationships and your reputation.",
          "The National Letter of Intent (NLI): The NLI is the binding document in college recruiting. For golf, the early signing period is typically in November, and the regular signing period begins in April. When you sign the NLI, you commit to attending that school for one academic year, and the school commits to providing the athletic financial aid specified in your offer.",
          "Before You Sign: Review the financial aid agreement carefully with your parents. Confirm the scholarship amount, duration, renewal conditions, and any summer aid. Understand what happens if you want to transfer (the NLI includes a release process). Ensure your NCAA eligibility is certified and your admissions application is complete. Ask the coach to outline your role on the team and expectations for your freshman year.",
          "Announcing Your Commitment: Many athletes share their commitment on social media. If you choose to do this, thank your family, coaches, and mentors who helped you along the way. Notify other programs that you've committed — don't leave coaches hanging. A brief, respectful email is sufficient: 'Thank you for your time and interest. I've decided to commit to [school]. I truly appreciate the opportunity to learn about your program.'",
          "After Signing: Your recruiting journey is over, but your preparation isn't. Stay focused on maintaining your GPA — your admission and eligibility depend on finishing strong academically. Continue competing in tournaments to stay sharp. Begin communicating with your future teammates and learn about the team's summer expectations. Start mentally preparing for the transition to college life.",
          "Celebrate This Achievement: You've accomplished something that fewer than 2% of high school golfers achieve. Regardless of the division or school, earning a spot on a college golf roster is a significant accomplishment. Be proud of the work you've put in."
        ],
        keyTakeaways: [
          "Verbal commitments are not binding — the NLI is the binding document",
          "Review financial aid agreements carefully before signing anything",
          "Notify other programs professionally when you commit elsewhere",
          "Maintain your GPA and keep competing after signing — your admission depends on it"
        ]
      },
      {
        id: "4-2",
        title: "Preparing for College Golf",
        description: "Physical prep, mental game, and practice planning",
        readTime: "6 min read",
        content: [
          "The gap between high school golf and college golf is significant. Players who prepare during the summer before freshman year arrive ready to compete; those who don't spend their first semester catching up. Here's how to bridge that gap.",
          "Physical Preparation: College golf requires a level of physical fitness most high school players haven't developed. Start a golf-specific fitness program that includes flexibility and mobility work (especially hips, shoulders, and thoracic spine), core strength training (anti-rotation exercises, planks, medicine ball work), lower body power (squats, lunges, deadlifts), and cardiovascular endurance (you'll walk 72+ holes per week in season). Work with a qualified trainer who understands golf-specific demands. Begin 3–4 months before arrival.",
          "Mental Game Development: The mental demands of college golf are intense. You'll face pressure to earn your spot in the lineup, deal with travel fatigue, and balance academic stress. Develop a pre-shot routine that you trust under pressure. Practice visualization — see the shot, feel the swing, trust the process. Learn to manage expectations — not every round will be your best, and that's okay. Consider working with a sports psychologist to develop mental performance skills.",
          "Practice Structure: College practice is more structured and purposeful than what most high school players are accustomed to. Begin transitioning your practice habits now. Implement block practice (repetitive drills for technique) alongside random practice (varying shots, targets, and clubs like on-course play). Practice with consequences — create games and competitions in practice to simulate pressure. Work on your weaknesses first, not just the parts of your game you enjoy.",
          "Course Management: College courses are typically longer, narrower, and more demanding than what you've played in high school. Practice smart course management: when to attack and when to play conservatively. Learn to play to your strengths — if you're not a long hitter, develop precision and short game to compete. Study yardage books and develop a systematic approach to course preparation.",
          "Communication with Your Future Coach: Ask your coach for specific expectations and summer training recommendations. Some programs provide workout plans, practice schedules, or reading lists for incoming freshmen. Understanding expectations before you arrive shows initiative and maturity. Ask about team equipment (bags, clubs, clothing) and what's provided vs. what you need to bring."
        ],
        keyTakeaways: [
          "Start a golf-specific fitness program 3–4 months before college arrival",
          "Develop a pre-shot routine and mental game skills for handling pressure",
          "Transition to structured, purposeful practice with consequence-based games",
          "Ask your future coach for specific summer training expectations and recommendations"
        ]
      },
      {
        id: "4-3",
        title: "The College Transition",
        description: "Team dynamics, time management, and thriving as a freshman",
        readTime: "6 min read",
        content: [
          "Walking onto a college campus as a freshman student-athlete is both thrilling and overwhelming. The players who thrive are those who prepare for the transition — not just athletically, but in every dimension of their new life.",
          "Time Management: This is the single biggest challenge for freshman student-athletes. A typical week might include 20+ hours of practice, travel, and competition; 15+ hours of classes; 2–3 hours of study hall; team meetings and film sessions; plus meals, sleep, and a social life. You MUST use a planner or calendar system. Block out non-negotiable time (classes, practice, study) first, then fill in everything else. The athletes who struggle most are those who don't plan their time intentionally.",
          "Team Dynamics: You're entering an established culture with upperclassmen who've earned their spots. Be humble and hungry. Listen more than you talk. Support your teammates — cheer loudly in practice qualifiers, help with team events, and be a positive presence in the team room. Earning respect takes time; demanding it never works.",
          "Relationship with Your Coach: Your relationship with your college coach will be different from any coaching relationship you've had. They're simultaneously your mentor, evaluator, and team leader. Accept feedback gracefully — it's an investment in your development, not criticism. Be proactive in communication: if you're struggling with something (golf, academics, or personal), tell your coach early. Coaches can't help with problems they don't know about.",
          "Academic Responsibilities: Attend every class, even when you're tired or traveling. Sit in the front row — professors notice and appreciate it. Use academic support services (tutoring, writing centers, study groups) from day one, not just when you're falling behind. Communicate with professors about travel schedules at the beginning of each semester. Most are accommodating when you're proactive and professional.",
          "Taking Care of Yourself: College athletes face unique mental health challenges — performance pressure, identity tied to sport, and being away from family. It's okay to struggle, and it's smart to seek help. Most athletic departments have sports psychologists, counselors, and support staff specifically for athletes. Develop healthy routines around sleep (8+ hours), nutrition (fuel for performance, not just convenience), and social connection (friends outside your team).",
          "Embracing the Experience: College golf is an incredible opportunity that very few people get to experience. There will be hard days — bad rounds, tough losses, demanding schedules. But there will also be some of the best moments of your life. Travel with your team, compete at amazing courses, build lifelong friendships, and grow as a player and person. Stay present and enjoy the journey."
        ],
        keyTakeaways: [
          "Time management is the #1 challenge — use a planning system from day one",
          "Be humble, supportive, and patient — earning team respect takes time",
          "Communicate proactively with coaches and professors about struggles and schedules",
          "Use athletic department mental health and academic support resources early"
        ]
      },
      {
        id: "4-4",
        title: "Common Mistakes & How to Avoid Them",
        description: "Real stories and lessons learned from the recruiting trail",
        readTime: "6 min read",
        content: [
          "After working with hundreds of families through the recruiting process, we've seen the same mistakes repeated over and over. Learning from others' missteps can save you time, money, and heartache.",
          "Mistake #1: Waiting Too Long to Start — The most common regret we hear is 'I wish we had started earlier.' Families who begin the recruiting process junior year are already behind. The research, relationship building, and preparation that should happen during freshman and sophomore years creates a foundation that can't be compressed into 12 months. Start early, even if you feel like you're not 'ready.'",
          "Mistake #2: Only Targeting D1 — Division I is not the only path to college golf, and for most players, it's not the right one. Only about 300 men's and 300 women's D1 golf programs exist, and roster spots are extremely limited. Players who fixate on D1 and ignore D2, D3, NAIA, and JUCO options often end up with fewer and worse choices. The best college experience is the one that fits you — not the one with the most prestige.",
          "Mistake #3: Neglecting Academics — We've seen talented golfers lose scholarship opportunities because their GPA or test scores didn't meet eligibility requirements. A 3.5 GPA opens doors that a 2.5 GPA cannot, regardless of how well you hit the ball. Academic problems are entirely preventable with planning and effort.",
          "Mistake #4: Parents Running the Show — Coaches want to recruit the student-athlete, not the parent. When a parent dominates every email, phone call, and campus visit, it raises red flags. Parents should be supportive and involved, but the player needs to own their recruiting process. Coaches will judge the player's maturity, communication skills, and independence.",
          "Mistake #5: Not Communicating with Coaches — Many talented players never get recruited simply because coaches didn't know they existed. Sending one email and waiting for a response is not a strategy. Consistent, professional outreach over months (not days) is how relationships develop. If a coach hasn't responded after 3–4 attempts, that's useful information too — move on to programs that value your interest.",
          "Mistake #6: Making a Decision Based on One Factor — Choosing a school because of one impressive visit, one coach's personality, or one scholarship offer without evaluating the full picture leads to transfer portal entries. Evaluate every school across athletic, academic, social, and financial dimensions. The glamour of a campus visit fades; the reality of daily life at that school lasts four years.",
          "Mistake #7: Burning Bridges — The golf world is small. Coaches talk to each other. If you handle a decommitment poorly, ghost a coach who invested time in you, or badmouth a program, it will follow you. Professionalism and honesty — even in uncomfortable situations — protect your reputation and keep doors open.",
          "The Bottom Line: The recruiting process rewards preparation, authenticity, and persistence. There's no shortcut, no hack, and no substitute for doing the work. But for families who commit to the process, the reward — a college education paired with competitive golf — is life-changing."
        ],
        keyTakeaways: [
          "Start the recruiting process freshman year — junior year is already late",
          "Don't fixate on D1 — the best fit matters more than the division label",
          "Let the player own their recruiting communications — coaches evaluate maturity",
          "Evaluate schools across ALL dimensions — don't commit based on a single factor"
        ]
      },
    ],
  },
];
