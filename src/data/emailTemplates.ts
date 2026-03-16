export interface EmailTemplate {
  title: string;
  subject: string;
  body: string;
}

export interface EmailTemplateCategory {
  category: string;
  templates: EmailTemplate[];
}

export const EMAIL_TEMPLATES: EmailTemplateCategory[] = [
  {
    category: "Initial Outreach",
    templates: [
      {
        title: "First Contact — Introduction Email",
        subject: "Prospective Student-Athlete — [Your Name], Class of [Year]",
        body: `Dear Coach [Last Name],

My name is [Your Name], and I am a [Grade] at [High School] in [City, State]. I am very interested in [University Name]'s golf program and would love the opportunity to be a part of your team.

Here are some of my recent accomplishments:
• Current handicap: [X.X]
• Scoring average: [XX.X] (18-hole)
• Notable finishes: [List 2-3 best results]
• GPA: [X.XX] | SAT: [Score] / ACT: [Score]

I have attached my athletic resume and a link to my highlight reel for your review: [Link]

I would welcome the opportunity to discuss how I can contribute to your program. Thank you for your time and consideration.

Sincerely,
[Your Name]
[Phone Number]
[Email Address]`,
      },
      {
        title: "Camp or Showcase Follow-Up",
        subject: "Thank You — [Your Name] from [Camp Name]",
        body: `Dear Coach [Last Name],

Thank you for the opportunity to participate in [Camp/Showcase Name] this past [weekend/week]. I truly enjoyed learning from you and your staff, and the experience reinforced my strong interest in [University Name].

During the event, I [mention a specific moment — e.g., "shot a 74 in the afternoon round" or "appreciated your feedback on my short game"].

I would love to stay in touch and learn more about the recruiting process for your program. Please let me know if there is any additional information I can provide.

Thank you again,
[Your Name]
[Phone Number]`,
      },
      {
        title: "Tournament Notification",
        subject: "Upcoming Tournament — [Tournament Name], [Date]",
        body: `Dear Coach [Last Name],

I wanted to let you know that I will be competing in [Tournament Name] at [Course Name] in [City, State] on [Dates]. I would be honored if you or a member of your staff could attend.

My tee time is [Time] on [Day], and I will be paired in [Group info if available].

I continue to be very interested in [University Name] and would love the chance to connect in person. Please let me know if you plan to attend — I would be happy to provide additional details.

Best regards,
[Your Name]
[Phone Number]`,
      },
      {
        title: "Questionnaire Completion Notice",
        subject: "Completed Recruiting Questionnaire — [Your Name]",
        body: `Dear Coach [Last Name],

I recently completed the recruiting questionnaire on the [University Name] athletics website and wanted to follow up personally. I am very interested in your golf program and believe it would be an excellent fit for me both academically and athletically.

A few quick highlights:
• Handicap: [X.X]
• GPA: [X.XX]
• Graduation Year: [Year]

I have also attached my athletic resume for your review. I look forward to hearing from you.

Sincerely,
[Your Name]`,
      },
      {
        title: "Mutual Connection Introduction",
        subject: "Introduction via [Mutual Contact Name]",
        body: `Dear Coach [Last Name],

[Mutual Contact Name] suggested I reach out to you regarding your golf program at [University Name]. [He/She] spoke very highly of your program and thought I might be a good fit.

I am currently a [Grade] at [High School] with a [X.X] handicap and [X.XX] GPA. I am very interested in learning more about opportunities with your team.

I have attached my resume and would welcome the chance to speak with you at your convenience.

Best regards,
[Your Name]`,
      },
    ],
  },
  {
    category: "Follow-Up Emails",
    templates: [
      {
        title: "Two-Week Follow-Up",
        subject: "Following Up — [Your Name], Class of [Year]",
        body: `Dear Coach [Last Name],

I wanted to follow up on my email from [date]. I remain very interested in [University Name]'s golf program and wanted to share a quick update:

[Share a recent result, improvement, or achievement]

I understand you are busy and appreciate your time. I would love to schedule a call or visit at your convenience.

Thank you,
[Your Name]
[Phone Number]`,
      },
      {
        title: "Season Results Update",
        subject: "Season Update — [Your Name]",
        body: `Dear Coach [Last Name],

I hope your season is going well. I wanted to share an update on my recent results:

• [Tournament 1]: [Score/Finish]
• [Tournament 2]: [Score/Finish]
• [Tournament 3]: [Score/Finish]
• Updated scoring average: [XX.X]

I continue to work hard on my game and remain very interested in [University Name]. I would appreciate any guidance on next steps in the recruiting process.

Best regards,
[Your Name]`,
      },
      {
        title: "After Campus Visit Thank You",
        subject: "Thank You for the Campus Visit — [Your Name]",
        body: `Dear Coach [Last Name],

Thank you so much for taking the time to show me around [University Name] on [Date]. I really enjoyed [mention specific things — meeting the team, seeing the facilities, the campus tour].

The visit confirmed that [University Name] is a top choice for me. I was especially impressed by [specific detail].

Please let me know if there are any next steps I should take. I look forward to staying in touch.

Sincerely,
[Your Name]`,
      },
      {
        title: "Checking In — No Response",
        subject: "Checking In — [Your Name]",
        body: `Dear Coach [Last Name],

I hope this message finds you well. I reached out a few weeks ago expressing my interest in [University Name]'s golf program and wanted to check in.

I understand recruiting is a busy process, and I appreciate your time. I have attached an updated resume with my latest tournament results for your review.

I would love the opportunity to connect — even a brief phone call would be greatly appreciated.

Thank you,
[Your Name]
[Phone Number]`,
      },
      {
        title: "Academic Achievement Update",
        subject: "Academic Update — [Your Name]",
        body: `Dear Coach [Last Name],

I wanted to share some exciting academic news — [describe achievement: honor roll, test score improvement, academic award].

My updated academic profile:
• GPA: [X.XX]
• SAT: [Score] / ACT: [Score]
• [Any honors or AP courses]

I continue to be very interested in [University Name] and believe I can contribute to your program both on the course and in the classroom.

Best regards,
[Your Name]`,
      },
    ],
  },
  {
    category: "Video & Media Submission",
    templates: [
      {
        title: "Highlight Reel Submission",
        subject: "Highlight Reel — [Your Name], Class of [Year]",
        body: `Dear Coach [Last Name],

I have put together a highlight reel showcasing my game and wanted to share it with you: [Video Link]

The reel includes footage from [list events/courses] and covers:
• Full swing (driver and irons)
• Short game and putting
• On-course management

I have also attached my updated athletic resume. I would greatly appreciate any feedback you might have.

Thank you for your time,
[Your Name]
[Phone Number]`,
      },
      {
        title: "Swing Video for Feedback",
        subject: "Swing Video for Your Review — [Your Name]",
        body: `Dear Coach [Last Name],

I have been working on [specific aspect of game] and would value your professional feedback. Here is a link to a recent swing video: [Link]

I am committed to improving and would be grateful for any coaching insights. I continue to be very interested in [University Name]'s program.

Thank you,
[Your Name]`,
      },
      {
        title: "Tournament Round Recap Video",
        subject: "Tournament Round Recap — [Tournament Name]",
        body: `Dear Coach [Last Name],

I recently competed in [Tournament Name] and put together a recap of my round: [Video Link]

I shot [Score] ([over/under par]) on a [yardage/slope] course. I was particularly pleased with [mention a strong part of the round].

I hope you enjoy the video and I look forward to your thoughts.

Best regards,
[Your Name]`,
      },
      {
        title: "Social Media / Profile Link Share",
        subject: "Recruiting Profile & Social Links — [Your Name]",
        body: `Dear Coach [Last Name],

I wanted to share my recruiting profiles and social media accounts where you can follow my progress:

• Recruiting Profile: [Link]
• Instagram: @[handle]
• Junior Golf Scoreboard: [Link]

I am actively competing this [season] and will be posting updates regularly. I would love for you to follow along.

Thank you,
[Your Name]`,
      },
      {
        title: "Updated Stats & Video Package",
        subject: "Updated Recruiting Package — [Your Name]",
        body: `Dear Coach [Last Name],

I have compiled an updated recruiting package with my latest stats and video content:

Stats:
• Handicap: [X.X]
• Scoring Average: [XX.X]
• Best 18-hole score: [Score]
• Top finishes: [List]

Video:
• Full highlight reel: [Link]
• Recent tournament round: [Link]

Resume: [Attached]

I remain very excited about [University Name] and would welcome any opportunity to discuss next steps.

Sincerely,
[Your Name]
[Phone Number]`,
      },
    ],
  },
];
