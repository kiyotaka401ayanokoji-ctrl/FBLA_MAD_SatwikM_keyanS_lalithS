import { supabase } from './supabase';

// Member interface
export interface Member {
  id: string;
  name: string;
  initials: string;
  bio: string;
  email?: string;
  created_at?: string;
}

export interface Event {
  id: string;
  name: string;
  created_at?: string;
}

export interface MemberEvent {
  member_id: string;
  event_id: string;
  member?: Member;
  event?: Event;
}

// Initialize and seed database
export const initMembersDatabase = async (): Promise<void> => {
  try {
    // Check if members already exist
    const { data: existingMembers, error: checkError } = await supabase
      .from('fbla_members')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking members:', checkError);
      return;
    }

    // If members exist, don't seed again
    if (existingMembers && existingMembers.length > 0) {
      console.log('Members database already seeded');
      return;
    }

    // Seed the database
    await seedMembersDatabase();
  } catch (error) {
    console.error('Error initializing members database:', error);
  }
};

// Get all members with their events
export const getAllMembers = async (): Promise<(Member & { events: Event[] })[]> => {
  try {
    const { data: members, error: membersError } = await supabase
      .from('fbla_members')
      .select('*')
      .order('name');

    if (membersError) throw membersError;

    if (!members) return [];

    // Get events for each member
    const membersWithEvents = await Promise.all(
      members.map(async (member) => {
        const { data: memberEvents, error: eventsError } = await supabase
          .from('fbla_member_events')
          .select('event:fbla_events(*)')
          .eq('member_id', member.id);

        if (eventsError) {
          console.error('Error fetching events for member:', eventsError);
          return { ...member, events: [] };
        }

        const events = memberEvents?.map((me: any) => me.event).filter(Boolean) || [];
        return { ...member, events };
      })
    );

    return membersWithEvents;
  } catch (error) {
    console.error('Error getting all members:', error);
    return [];
  }
};

// Search members by name
export const searchMembersByName = async (query: string): Promise<(Member & { events: Event[] })[]> => {
  try {
    const { data: members, error } = await supabase
      .from('fbla_members')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name');

    if (error) throw error;

    if (!members) return [];

    // Get events for each member
    const membersWithEvents = await Promise.all(
      members.map(async (member) => {
        const { data: memberEvents, error: eventsError } = await supabase
          .from('fbla_member_events')
          .select('event:fbla_events(*)')
          .eq('member_id', member.id);

        if (eventsError) {
          console.error('Error fetching events for member:', eventsError);
          return { ...member, events: [] };
        }

        const events = memberEvents?.map((me: any) => me.event).filter(Boolean) || [];
        return { ...member, events };
      })
    );

    return membersWithEvents;
  } catch (error) {
    console.error('Error searching members by name:', error);
    return [];
  }
};

// Search members by event
export const searchMembersByEvent = async (eventQuery: string): Promise<{ eventName: string; members: (Member & { events: Event[] })[] }[]> => {
  try {
    // Find matching events
    const { data: events, error: eventsError } = await supabase
      .from('fbla_events')
      .select('*')
      .ilike('name', `%${eventQuery}%`)
      .order('name');

    if (eventsError) throw eventsError;

    if (!events || events.length === 0) return [];

    // For each event, get all members
    const results = await Promise.all(
      events.map(async (event) => {
        const { data: memberEvents, error: memberEventsError } = await supabase
          .from('fbla_member_events')
          .select('member:fbla_members(*)')
          .eq('event_id', event.id);

        if (memberEventsError) {
          console.error('Error fetching members for event:', memberEventsError);
          return { eventName: event.name, members: [] };
        }

        const members = memberEvents?.map((me: any) => me.member).filter(Boolean) || [];

        // Get all events for each member
        const membersWithEvents = await Promise.all(
          members.map(async (member: Member) => {
            const { data: allMemberEvents, error: allEventsError } = await supabase
              .from('fbla_member_events')
              .select('event:fbla_events(*)')
              .eq('member_id', member.id);

            if (allEventsError) {
              return { ...member, events: [] };
            }

            const events = allMemberEvents?.map((me: any) => me.event).filter(Boolean) || [];
            return { ...member, events };
          })
        );

        return { eventName: event.name, members: membersWithEvents };
      })
    );

    return results;
  } catch (error) {
    console.error('Error searching members by event:', error);
    return [];
  }
};

// Seed database with all members and events
const seedMembersDatabase = async (): Promise<void> => {
  try {
    console.log('Seeding members database...');

    // All members with their bios
    const membersData = [
      { name: 'Ashrit Kopparthi', bio: 'Passionate about finance and international business strategy.' },
      { name: 'Ian Mendonca', bio: 'Tech enthusiast with a love for problem-solving.' },
      { name: 'Aayush Pant', bio: 'Coding wizard and competitive programming champion.' },
      { name: 'Atiksh Matharu', bio: 'Detail-oriented and always ready for a challenge.' },
      { name: 'Liam Chang', bio: 'Team player with strong analytical skills.' },
      { name: 'Rohaan Pasha', bio: 'Finance geek who loves crunching numbers.' },
      { name: 'Sacchit Boddapati', bio: 'Data science enthusiast and AI explorer.' },
      { name: 'Gautham Manigantan', bio: 'Full-stack developer with a creative edge.' },
      { name: 'Niya Aslam', bio: 'Marketing maven with a flair for creativity.' },
      { name: 'Deethya Anuga', bio: 'Ambitious entrepreneur with big ideas.' },
      { name: 'Lucky Kadiam', bio: 'Sales expert who loves connecting with people.' },
      { name: 'Vienna Shin', bio: 'Strategic thinker with a passion for advertising.' },
      { name: 'Olivia Shin', bio: 'Creative mind always looking for the next big thing.' },
      { name: 'Naman Agrawal', bio: 'Tech support guru and problem solver.' },
      { name: 'Sprihi Sharma', bio: 'Agribusiness advocate and sustainability champion.' },
      { name: 'Gabrielle Quiere', bio: 'Organized leader with a knack for planning.' },
      { name: 'Ashmi Shah', bio: 'Healthcare enthusiast dedicated to making a difference.' },
      { name: 'Samhitha Manukonda', bio: 'Banking expert with a strategic mindset.' },
      { name: 'Aman Kolli', bio: 'Finance whiz with entrepreneurial spirit.' },
      { name: 'Saipranav Rebala', bio: 'Supply chain strategist and logistics pro.' },
      { name: 'Brandon Osckar', bio: 'Personal finance advocate helping others succeed.' },
      { name: 'Sameer Hussaini', bio: 'Risk management specialist with sharp instincts.' },
      { name: 'Shaurya Bansal', bio: 'Broadcast journalist with a voice for change.' },
      { name: 'Arush Rasure', bio: 'Business law enthusiast and debate champion.' },
      { name: 'Shikha Prajapati', bio: 'Future educator inspiring the next generation.' },
      { name: 'Niteesh AJ', bio: 'Media producer with a passion for storytelling.' },
      { name: 'Aashi Patel', bio: 'Parliamentary procedure expert and leader.' },
      { name: 'Shriya Aroun', bio: 'Team collaborator with excellent communication skills.' },
      { name: 'Rachel So', bio: 'Organized and detail-focused project manager.' },
      { name: 'Anoushka Haloi', bio: 'Public service advocate making an impact.' },
      { name: 'Natalie Ho', bio: 'Event planner extraordinaire with creative vision.' },
      { name: 'Saranya Potukuchi', bio: 'Visual designer bringing ideas to life.' },
      { name: 'Varalika Konduri', bio: 'Broadcast journalist covering the latest news.' },
      { name: 'Saiprajna Ravooru', bio: 'Public speaker inspiring audiences everywhere.' },
      { name: 'Shrita Kopparthi', bio: 'Business communicator with persuasive skills.' },
      { name: 'Ved Dalvi', bio: 'Business procedures expert and efficiency guru.' },
      { name: 'Varun Patwardhan', bio: 'Broadcast journalist with investigative skills.' },
      { name: 'Rafail Popa', bio: 'Business management strategist and innovator.' },
      { name: 'Khushi Bhimani', bio: 'Job interview coach helping others shine.' },
      { name: 'Anna Abraham', bio: 'Financial planner with a heart for helping others.' },
      { name: 'Kriyan Krishnan', bio: 'Digital video producer and creative storyteller.' },
      { name: 'Sahana Singh', bio: 'Retail management expert with customer focus.' },
      { name: 'Rohil Varshney', bio: 'Digital content creator and video editor.' },
      { name: 'Iman Siddiqui', bio: 'Sales presentation pro with charisma.' },
      { name: 'Nitya Anand', bio: 'Journalism enthusiast uncovering the truth.' },
      { name: 'Amr Omar', bio: 'Business ethics advocate for corporate responsibility.' },
      { name: 'Muhammad Koul', bio: 'Ethical business leader with strong values.' },
      { name: 'Adam Alaruri', bio: 'Healthcare administrator improving patient care.' },
      { name: 'Kashvi Arora', bio: 'Organizational leader driving team success.' },
      { name: 'Ananya Mallick', bio: 'Event planner creating unforgettable experiences.' },
      { name: 'Shrita Palla', bio: 'Business law scholar and advocate.' },
      { name: 'Snigdha Sri Garlapati', bio: 'Financial analyst with sharp insights.' },
      { name: 'Ellisandra Sou', bio: 'Business ethics champion for transparency.' },
      { name: 'Tanvi Kuttuva', bio: 'Intro to business communication rising star.' },
      { name: 'Aashini Ramesh', bio: 'Business ethics researcher and writer.' },
      { name: 'Swarali Karale', bio: 'Website designer with an eye for aesthetics.' },
      { name: 'Srianvika Siram', bio: 'Business ethics advocate and team player.' },
      { name: 'Puranjay Wadhawan', bio: 'Business law expert with a sharp legal mind.' },
      { name: 'Gayathri Priya Balla', bio: 'Journalism writer with a passion for truth.' },
      { name: 'Swati Premkumar', bio: 'Business law researcher and policy enthusiast.' },
      { name: 'Saanvi Lankalapalli', bio: 'Parliamentary procedure advocate and organizer.' },
      { name: 'Aahna Dattkaya', bio: 'Retail merchandising expert with style.' },
      { name: 'Ayla Tamber', bio: 'Event planner and business management leader.' },
      { name: 'Keerth Kotha', bio: 'Business concepts enthusiast and quick learner.' },
      { name: 'Amogh Jain', bio: 'Website design pro with creative flair.' },
      { name: 'Rajeev Kalagara', bio: 'Business management strategist and innovator.' },
      { name: 'Nella Sharma', bio: 'Customer service champion with a smile.' },
      { name: 'Amreen Dadwal', bio: 'Real estate enthusiast and market analyst.' },
      { name: 'Elizabeth Tselyuk', bio: 'Intro to business presentation star.' },
      { name: 'Sashvitha Poobalan', bio: 'Social media strategist and content creator.' },
      { name: 'Isabella Salazar', bio: 'Social media expert with viral ideas.' },
      { name: 'Abhi Kaki', bio: 'Business management leader with vision.' },
      { name: 'Hei kan Tang', bio: 'Business management team player.' },
      { name: 'Arnav Verma', bio: 'Business management strategist.' },
      { name: 'Vihaan Singh', bio: 'Data analyst and business plan creator.' },
      { name: 'Ruhaan Sidhu', bio: 'Business plan developer with entrepreneurial spirit.' },
      { name: 'Rayan Alam', bio: 'Website coding expert and developer.' },
      { name: 'Anushree Gupta', bio: 'Business plan strategist and social media guru.' },
      { name: 'Vilina Pai', bio: 'Human resources advocate and business planner.' },
      { name: 'Tanisha Chandel', bio: 'Graphic designer with creative vision.' },
      { name: 'Tanishka Yella', bio: 'Business plan creator and graphic designer.' },
      { name: 'Avantika Santhosh', bio: 'Business plan team member with fresh ideas.' },
      { name: 'Prisha Sharma', bio: 'Data science enthusiast and business planner.' },
      { name: 'Ayush Balwalli', bio: 'Sports management expert and entrepreneur.' },
      { name: 'Kailani Fisher', bio: 'Sports management strategist.' },
      { name: 'Shahaan Dhebar', bio: 'Entrepreneurship advocate and business planner.' },
      { name: 'Aaric Das', bio: 'Business plan developer with analytical skills.' },
      { name: 'Aarav Verma', bio: 'Business plan creator and strategist.' },
      { name: 'Satvik Tadiparti', bio: 'Retail merchandising and business plan expert.' },
      { name: 'Sneha Nandkeolyar', bio: 'Career portfolio builder and entrepreneur.' },
      { name: 'Geethika Chandolu', bio: 'Social media strategist and career planner.' },
      { name: 'Saswathy Srishankar', bio: 'Career portfolio expert and job interview pro.' },
      { name: 'Jahnavi Shukla', bio: 'Career portfolio builder with ambition.' },
      { name: 'Ali Mirza', bio: 'Career planner and public speaker.' },
      { name: 'Alisa Kyrychenko', bio: 'Career portfolio creator and website developer.' },
      { name: 'Aadit Aggarwal', bio: 'Coding expert and mobile app developer.' },
      { name: 'Rithvika Devisetti', bio: 'Coding enthusiast and website developer.' },
      { name: 'Sayesha Rajbhandari', bio: 'Coding pro and website coder.' },
      { name: 'Gagana Rudra Bodala', bio: 'Computer programming and website design expert.' },
      { name: 'Sarthak Kansal', bio: 'Computer applications specialist and intro to business comm star.' },
      { name: 'Riddhesh Jaini', bio: 'Computer applications expert and supply chain enthusiast.' },
      { name: 'Anvi Dua', bio: 'Computer applications pro and website developer.' },
      { name: 'Matthew Kokhan', bio: 'Computer game programming and graphic design expert.' },
      { name: 'Eric Luo', bio: 'Computer game programmer and graphic designer.' },
      { name: 'Srivats Iyer', bio: 'Computer game programming enthusiast.' },
      { name: 'Aryaman Rao', bio: 'Computer game programmer and supply chain strategist.' },
      { name: 'Abhinav Iyer', bio: 'Computer game programming and insurance expert.' },
      { name: 'Dhanuh Bogam', bio: 'Computer game programming and cybersecurity pro.' },
      { name: 'Elina Shah', bio: 'Computer game programming and intro to programming star.' },
      { name: 'Ashrita Saravanan Vaishnavi', bio: 'Computer game programming and cybersecurity expert.' },
      { name: 'Aishwarya Kumaran', bio: 'Computer problem solving and website coding pro.' },
      { name: 'Mahima Iyer', bio: 'Computer problem solving and future business leader.' },
      { name: 'Shubh Parihar', bio: 'Computer problem solving and data science enthusiast.' },
      { name: 'Akshar Parmar', bio: 'Computer problem solving and website design expert.' },
      { name: 'Aditi Kesarwani', bio: 'Computer problem solving and event planning pro.' },
      { name: 'Ryan Cutinha', bio: 'Computer problem solving and networking expert.' },
      { name: 'Ryan Wang', bio: 'Computer problem solving and mobile app developer.' },
      { name: 'Meera Bhise', bio: 'Customer service champion and sports management enthusiast.' },
      { name: 'Maitree Chauhan', bio: 'Customer service expert and human resources advocate.' },
      { name: 'Megan Song', bio: 'Customer service pro and marketing strategist.' },
      { name: 'Sarah Chung', bio: 'Customer service specialist and impromptu speaker.' },
      { name: 'Krish Shah', bio: 'Customer service and intro to marketing expert.' },
      { name: 'Aanya Sheth', bio: 'Customer service and event planning pro.' },
      { name: 'Feven Bizuayehu', bio: 'Cybersecurity expert and data analyst.' },
      { name: 'Yusuf Abbasi', bio: 'Cybersecurity pro and website designer.' },
      { name: 'Ayla Mir', bio: 'Cybersecurity enthusiast and data analyst.' },
      { name: 'Adyan Ali', bio: 'Cybersecurity expert and sales presenter.' },
      { name: 'Mikul Pasupathi', bio: 'Cybersecurity pro and intro to business presentation star.' },
      { name: 'Vivaan Pole', bio: 'Cybersecurity enthusiast and intro to social media strategist.' },
      { name: 'Yuvin Agrawal', bio: 'Cybersecurity and data science expert.' },
      { name: 'Shaurya Gera', bio: 'Data analyst and data science enthusiast.' },
      { name: 'Sreshta Namala', bio: 'Data analyst and public speaker.' },
      { name: 'Vanshika Kalluri', bio: 'Data analyst and hospitality management expert.' },
      { name: 'Nishtha Priya', bio: 'Data analyst and networking infrastructure pro.' },
      { name: 'Pushkal Kumar', bio: 'Data analyst and mobile app developer.' },
      { name: 'Guhan Thiagarajan', bio: 'Data analyst and networking expert.' },
      { name: 'Sujan Saravanan', bio: 'Data analyst and intro to business presentation star.' },
      { name: 'Sidharth Vellanki', bio: 'Data analyst and network design expert.' },
      { name: 'Abhinav Bonagiri', bio: 'Data analyst and network design pro.' },
      { name: 'Saravana Jayavelu', bio: 'Data analyst and sports management strategist.' },
      { name: 'Venkat Chandra', bio: 'Data analyst and future business leader.' },
      { name: 'Neel Patel', bio: 'Data analyst and future business leader.' },
      { name: 'Fiona Au', bio: 'Data analyst and public service announcement creator.' },
      { name: 'Ronit Agarwal', bio: 'Data science and website coding expert.' },
      { name: 'Satya Tumuluri', bio: 'Data science and economics enthusiast.' },
      { name: 'Vyom Joshi', bio: 'Data science and financial planning expert.' },
      { name: 'Vidhyuth Rajesh Kanna', bio: 'Data science and economics pro.' },
      { name: 'Shreya Battula', bio: 'Data science and intro to programming star.' },
      { name: 'Shaaz Alicherry', bio: 'Data science and international business expert.' },
      { name: 'Devansh Ahuja', bio: 'Data science and intro to business presentation pro.' },
      { name: 'Rithwik Bhimanadhuni', bio: 'Data science and digital video production expert.' },
      { name: 'Gyandeep Kintali', bio: 'Data science enthusiast with analytical skills.' },
      { name: 'Avisha Agrawal', bio: 'Digital animation creator and intro to IT expert.' },
      { name: 'Disha Pudakar', bio: 'Digital animation artist with creative vision.' },
      { name: 'Saisha Agarwal', bio: 'Digital animation creator and intro to parliamentary procedure star.' },
      { name: 'Oviya Raja', bio: 'Digital animation artist and healthcare administration expert.' },
      { name: 'Arian Khaire', bio: 'Digital animation creator and sports management enthusiast.' },
      { name: 'Krishna Chintalapati', bio: 'Digital animation artist and hospitality management expert.' },
      { name: 'Mikail Ahmed', bio: 'Digital animation creator and personal finance pro.' },
      { name: 'Ishaan Agarwal', bio: 'Digital animation artist and website design expert.' },
      { name: 'Kavya Subramanian', bio: 'Digital video producer and sales presenter.' },
      { name: 'tarinika prasath', bio: 'Digital video producer and securities expert.' },
      { name: 'Saptaparna Dey', bio: 'Digital video producer with storytelling skills.' },
      { name: 'Joel Bijoy', bio: 'Digital video producer and website coder.' },
      { name: 'Rishik Birru', bio: 'Digital video producer and website coder.' },
      { name: 'Pranav Saravanan', bio: 'Digital video producer and financial analyst.' },
      { name: 'Benjamin Xavier', bio: 'Digital video producer and future business educator.' },
      { name: 'Marcus Balauag', bio: 'Digital video producer and financial analyst.' },
      { name: 'Keyan Shah', bio: 'Digital video producer and mobile app developer.' },
      { name: 'Aadhav Iyer', bio: 'Digital video producer with creative skills.' },
      { name: 'Max Trepp', bio: 'Digital video producer and content creator.' },
      { name: 'Pratyush Patnaik', bio: 'Digital video producer and insurance expert.' },
      { name: 'Tasmia Minhaz', bio: 'Economics and graphic design enthusiast.' },
      { name: 'Anisha Datta', bio: 'Economics and financial analyst.' },
      { name: 'Rayan Aziz', bio: 'Economics and personal finance expert.' },
      { name: 'Nathan Dusapin', bio: 'Economics and personal finance pro.' },
      { name: 'Saahithi Mamillapalli', bio: 'Entrepreneurship and marketing strategist.' },
      { name: 'Julian Sieu', bio: 'Entrepreneurship and sales expert.' },
      { name: 'Ajay Joshi', bio: 'Entrepreneurship and intro to parliamentary procedure advocate.' },
      { name: 'Aniruddh Gatla', bio: 'Entrepreneurship and international business expert.' },
      { name: 'Om Kharade', bio: 'Entrepreneurship and intro to business presentation star.' },
      { name: 'Kobee Tan', bio: 'Entrepreneurship enthusiast with business acumen.' },
      { name: 'Elisha Kim', bio: 'Event planning and intro to marketing expert.' },
      { name: 'Sabrina Castellanos French', bio: 'Event planner with organizational skills.' },
      { name: 'Sinchana Vivek', bio: 'Event planner and sales presenter.' },
      { name: 'Dhatri Achyutha', bio: 'Event planner and healthcare administration expert.' },
      { name: 'Nayana Surisetti', bio: 'Event planner and intro to social media strategist.' },
      { name: 'Varenya Pothukuchi', bio: 'Event planner and visual designer.' },
      { name: 'Yasha Gatla', bio: 'Event planner and international business expert.' },
      { name: 'Srianshi Samantaray', bio: 'Event planner and financial planner.' },
      { name: 'Rithika Pooboni', bio: 'Event planner and graphic designer.' },
      { name: 'Quinlan Pradana', bio: 'Event planner with creative ideas.' },
      { name: 'Aarav Patil', bio: 'Event planner and sports management enthusiast.' },
      { name: 'Vamika Putane', bio: 'Event planner with organizational skills.' },
      { name: 'Samvit Nadgouda', bio: 'Event planner and intro to FBLA star.' },
      { name: 'Aileen Putla', bio: 'Event planner and website designer.' },
      { name: 'Ritul Dwivedi', bio: 'Event planner and public speaker.' },
      { name: 'Sahana Senthilkumar', bio: 'Event planner and visual designer.' },
      { name: 'Angelika Prabhu', bio: 'Event planner and visual designer.' },
      { name: 'Sarah John', bio: 'Event planner and social media strategist.' },
      { name: 'Andrea Chalissery', bio: 'Event planner and intro to business concepts expert.' },
      { name: 'Komalika Mamidi', bio: 'Financial planner and intro to business presentation star.' },
      { name: 'Nandini Komma', bio: 'Financial planner and intro to business presentation star.' },
      { name: 'Samhitha Nekkanty', bio: 'Financial planner and social media strategist.' },
      { name: 'Joshita Munnangi', bio: 'Financial planner and social media strategist.' },
      { name: 'Anshi Mehta', bio: 'Financial planner and social media strategist.' },
      { name: 'Devansh Agarwal', bio: 'Financial planner and intro to programming expert.' },
      { name: 'Aiden Sol', bio: 'Financial planner and social media strategist.' },
      { name: 'Nathan Son', bio: 'Financial planner and social media strategist.' },
      { name: 'Jeffrey Jiang', bio: 'Financial planner and personal finance expert.' },
      { name: 'Advaith Koushik', bio: 'Financial analyst and intro to programming expert.' },
      { name: 'Anay Arya', bio: 'Financial analyst and network design expert.' },
      { name: 'Nishad Satghare', bio: 'Financial analyst and network design expert.' },
      { name: 'Matthew Song', bio: 'Financial analyst and network design expert.' },
      { name: 'Jaithra Putane', bio: 'Financial analyst and public service announcement creator.' },
      { name: 'Sarayu Nukala', bio: 'Financial analyst and mobile app developer.' },
      { name: 'Sanskriti Shukla', bio: 'Financial analyst and public administration expert.' },
      { name: 'Anusha Date', bio: 'Financial analyst and supply chain expert.' },
      { name: 'Rishitha Sindogi', bio: 'Future business educator and parliamentary procedure expert.' },
      { name: 'Sara Kansal', bio: 'Future business educator and social media strategist.' },
      { name: 'Anaya Borade', bio: 'Future business educator and project manager.' },
      { name: 'Kelly Mascarenhas', bio: 'Future business educator and sports management enthusiast.' },
      { name: 'Ishaan Regalla', bio: 'Future business leader and real estate expert.' },
      { name: 'Aradhna Praveen', bio: 'Future business leader and social media strategist.' },
      { name: 'Mahi Parikh', bio: 'Graphic designer and securities expert.' },
      { name: 'Saanvi Vijayvargiya', bio: 'Graphic designer and visual designer.' },
      { name: 'Ananya Gupta', bio: 'Graphic designer and international business expert.' },
      { name: 'Tej Simha Tummapudi', bio: 'Graphic designer and website coder.' },
      { name: 'Kody Choi', bio: 'Graphic designer and public service announcement creator.' },
      { name: 'Gianna Canos', bio: 'Graphic designer and parliamentary procedure expert.' },
      { name: 'Sankari Kk', bio: 'Graphic designer and public speaker.' },
      { name: 'Ajooni Dhanoa', bio: 'Graphic designer and visual designer.' },
      { name: 'Andy Yang', bio: 'Graphic designer and website designer.' },
      { name: 'Soumil Pole', bio: 'Graphic designer and website designer.' },
      { name: 'Avni Panchal', bio: 'Graphic designer and visual designer.' },
      { name: 'Kavya Mohanasundaram', bio: 'Graphic designer and visual designer.' },
      { name: 'Yunhan Li', bio: 'Graphic designer and website designer.' },
      { name: 'Sanjana Krishnan', bio: 'Healthcare administrator and social media strategist.' },
      { name: 'Srinath Vemula', bio: 'Healthcare administrator and real estate expert.' },
      { name: 'Ellena Wong', bio: 'Healthcare administrator and human resources expert.' },
      { name: 'Shravya More', bio: 'Healthcare administrator and social media strategist.' },
      { name: 'Laya Mohan', bio: 'Healthcare administrator with compassion.' },
      { name: 'Katie Park', bio: 'Hospitality management and intro to marketing expert.' },
      { name: 'Anuva Shrestha', bio: 'Hospitality management expert with service skills.' },
      { name: 'Rebecca Li', bio: 'Hospitality management and intro to business presentation star.' },
      { name: 'Aarav Mohindra', bio: 'Hospitality management enthusiast.' },
      { name: 'Neev Popli', bio: 'Hospitality management and public speaker.' },
      { name: 'Prisha Mundra', bio: 'Hospitality management and parliamentary procedure expert.' },
      { name: 'Harp Brar', bio: 'Hospitality management and parliamentary procedure expert.' },
      { name: 'Joshua Yeo', bio: 'Hospitality management and social media strategist.' },
      { name: 'Caleb Yeo', bio: 'Hospitality management and parliamentary procedure expert.' },
      { name: 'Edward Zhang', bio: 'Hospitality management and marketing strategist.' },
      { name: 'Pariza Nizam', bio: 'Human resources and organizational leadership expert.' },
      { name: 'Eliana Chung', bio: 'Human resources and marketing strategist.' },
      { name: 'Shruti Vinodkumar', bio: 'Human resources and parliamentary procedure expert.' },
      { name: 'Aiden Silva', bio: 'Impromptu speaker and intro to public speaking star.' },
      { name: 'Ronak Singh', bio: 'Impromptu speaker and parliamentary procedure expert.' },
      { name: 'Bhadra Pillai', bio: 'Impromptu speaker with confidence.' },
      { name: 'Abhay Sankar', bio: 'Impromptu speaker and public speaker.' },
      { name: 'Ibrahim Ansari', bio: 'Impromptu speaker and parliamentary procedure expert.' },
      { name: 'Ishaan Sharma', bio: 'Insurance and risk management expert.' },
      { name: 'Vivaan Singh', bio: 'Insurance and intro to business communication expert.' },
      { name: 'Charik Malik', bio: 'Insurance and project management expert.' },
      { name: 'Manvik Madupuru', bio: 'International business and job interview expert.' },
      { name: 'Mehar Uppal', bio: 'International business and marketing strategist.' },
      { name: 'Ayushi Malla', bio: 'International business and intro to public speaking star.' },
      { name: 'Arul Saravanan', bio: 'International business and intro to business presentation star.' },
      { name: 'Niyati Rao', bio: 'Intro to business communication and intro to social media expert.' },
      { name: 'Dhriti Baireddy', bio: 'Intro to business communication and intro to public speaking star.' },
      { name: 'Nishka Bansal', bio: 'Intro to business communication and intro to business procedures expert.' },
      { name: 'Vaibhu Lakkakula', bio: 'Intro to business concepts and network design expert.' },
      { name: 'Kanak Aggarwal', bio: 'Intro to business concepts and marketing strategist.' },
      { name: 'Tanvi Kadiyala', bio: 'Intro to business concepts and intro to business presentation star.' },
      { name: 'Ronin Issa', bio: 'Intro to business concepts enthusiast.' },
      { name: 'Krithikha Bharathy', bio: 'Intro to business presentation star.' },
      { name: 'Kavya Seshan', bio: 'Intro to business presentation star.' },
      { name: 'Vedant Gopalan', bio: 'Intro to business presentation and intro to programming expert.' },
      { name: 'Jerry Qu', bio: 'Intro to business presentation and intro to public speaking star.' },
      { name: 'Vanshi Patel', bio: 'Intro to business presentation and intro to social media strategist.' },
      { name: 'Vera Heng', bio: 'Intro to business presentation star.' },
      { name: 'Maithili Nadig', bio: 'Intro to business presentation and intro to social media strategist.' },
      { name: 'Sahithya Vellanki', bio: 'Intro to business presentation star.' },
      { name: 'Tanirika Koka', bio: 'Intro to business presentation and intro to social media strategist.' },
      { name: 'Aarna Vinay', bio: 'Intro to business presentation star.' },
      { name: 'Riya Ageeru', bio: 'Intro to business presentation star.' },
      { name: 'Saanvi Sahoo', bio: 'Intro to business presentation star.' },
      { name: 'Keely Fan', bio: 'Intro to business presentation star.' },
      { name: 'Nikhil Tummapudi', bio: 'Intro to business presentation star.' },
      { name: 'Siddhanth Maurya', bio: 'Intro to business presentation star.' },
      { name: 'Aarush Shinu', bio: 'Intro to business presentation star.' },
      { name: 'Rehan Shaikh', bio: 'Intro to business presentation star.' },
      { name: 'Adhyan Rangole', bio: 'Intro to business presentation star.' },
      { name: 'Sammith Kuluru', bio: 'Intro to business presentation star.' },
      { name: 'Sankeerth Vallapureddy', bio: 'Intro to business procedures and intro to business presentation star.' },
      { name: 'Pranav Sharma', bio: 'Intro to business procedures and intro to public speaking star.' },
      { name: 'Ishita Ponnaganti', bio: 'Intro to business procedures and visual designer.' },
      { name: 'Akshita Burra', bio: 'Intro to FBLA and sports management expert.' },
      { name: 'Akshat Kumar', bio: 'Intro to FBLA and job interview expert.' },
      { name: 'Yatee Makadia', bio: 'Intro to FBLA enthusiast.' },
      { name: 'Aarav Marok', bio: 'Intro to FBLA and intro to retail expert.' },
      { name: 'Aarav Sharma', bio: 'Intro to IT and intro to programming expert.' },
      { name: 'Anika Sharma', bio: 'Intro to IT and sales presenter.' },
      { name: 'Adhu Manikandan', bio: 'Intro to IT enthusiast.' },
      { name: 'Shresta Srinivasa', bio: 'Intro to IT and intro to programming expert.' },
      { name: 'Suluv Vaish', bio: 'Intro to IT and intro to public speaking star.' },
      { name: 'Arnav Singh', bio: 'Intro to marketing and intro to social media expert.' },
      { name: 'Lasya Vadakuppa', bio: 'Intro to marketing and sales presenter.' },
      { name: 'Amy Deepu', bio: 'Intro to marketing and intro to social media expert.' },
      { name: 'Diya Patel', bio: 'Intro to parliamentary procedure and public service announcement creator.' },
      { name: 'Akshaya Nandigama', bio: 'Intro to programming enthusiast.' },
      { name: 'Tanisha Shankpal', bio: 'Intro to programming and network design expert.' },
      { name: 'Yo-Cheng Liao', bio: 'Intro to programming and management information systems expert.' },
      { name: 'Reyansh Kuntawar', bio: 'Intro to programming and intro to social media strategist.' },
      { name: 'Rishi Kumpatla', bio: 'Intro to programming and sales presenter.' },
      { name: 'Samick Churi', bio: 'Intro to public speaking and intro to business presentation star.' },
      { name: 'Rajit Sen', bio: 'Intro to public speaking and retail management expert.' },
      { name: 'Angelina Samuel', bio: 'Intro to public speaking star.' },
      { name: 'Lalith Senthil', bio: 'Intro to retail and mobile app developer.' },
      { name: 'Reyansh Kuntawar', bio: 'Intro to social media and intro to programming expert.' },
      { name: 'Connor Huang', bio: 'Intro to social media and parliamentary procedure expert.' },
      { name: 'Nita Swadesh', bio: 'Intro to social media strategist.' },
      { name: 'Muskaan Mathur', bio: 'Intro to social media strategist.' },
      { name: 'Evelyn Lee', bio: 'Intro to social media strategist.' },
      { name: 'Chloe Kao', bio: 'Intro to social media strategist.' },
      { name: 'Atishay Gupta', bio: 'Intro to social media and supply chain expert.' },
      { name: 'Micah Park', bio: 'Intro to social media and supply chain expert.' },
      { name: 'Meenakshi Eashwar', bio: 'Intro to social media and public speaker.' },
      { name: 'Amogh Murthy', bio: 'Intro to social media strategist.' },
      { name: 'Maaya Ramesh', bio: 'Intro to social media strategist.' },
      { name: 'Shayantam Singh', bio: 'Intro to social media strategist.' },
      { name: 'Aarin Hatkhamkar', bio: 'Intro to social media strategist.' },
      { name: 'Priyanna Naicker', bio: 'Intro to social media strategist.' },
      { name: 'Nikhita Panja', bio: 'Intro to social media strategist.' },
      { name: 'Manish Vishnuram', bio: 'Intro to supply chain and supply chain management expert.' },
      { name: 'Akshaini Yanamandra', bio: 'Intro to supply chain enthusiast.' },
      { name: 'Kayla Phan', bio: 'Intro to supply chain and securities expert.' },
      { name: 'Namya Thareja', bio: 'Intro to supply chain enthusiast.' },
      { name: 'Aditya Chattopadhyay', bio: 'Intro to supply chain enthusiast.' },
      { name: 'Prakruthi Venugopalan', bio: 'Job interview expert and website designer.' },
      { name: 'Calvin Widjaja', bio: 'Job interview expert and project manager.' },
      { name: 'Arham Tanweer', bio: 'Journalism and public administration expert.' },
      { name: 'Advaith Voodem', bio: 'Management information systems and parliamentary procedure expert.' },
      { name: 'Rishi Khante', bio: 'Management information systems and network design expert.' },
      { name: 'Aanya Rawal', bio: 'Management information systems and website coding expert.' },
      { name: 'Andy Zhang', bio: 'Management information systems enthusiast.' },
      { name: 'Aadhya Goyal', bio: 'Management information systems and website coding expert.' },
      { name: 'Alisha Verma', bio: 'Marketing and visual designer.' },
      { name: 'Minh Nguyen', bio: 'Marketing and parliamentary procedure expert.' },
      { name: 'Nivedita Saju Menon', bio: 'Marketing and parliamentary procedure expert.' },
      { name: 'Samhith Kotapalle', bio: 'Marketing and sales presenter.' },
      { name: 'Ritvik Bansal', bio: 'Mobile app developer and parliamentary procedure expert.' },
      { name: 'Satwik Mannepalli', bio: 'Mobile app developer and technology support expert.' },
      { name: 'Gordon Zhang', bio: 'Mobile app developer and network design expert.' },
      { name: 'Tanisha Shankpal', bio: 'Network design and intro to programming expert.' },
      { name: 'Anvith Neelam', bio: 'Network design and website coding expert.' },
      { name: 'Sybe Hofman', bio: 'Networking infrastructure and website coding expert.' },
      { name: 'Siyona Sharma', bio: 'Organizational leadership and sales presenter.' },
      { name: 'Samya Sharma', bio: 'Parliamentary procedure and supply chain expert.' },
      { name: 'Aneri Bhatt', bio: 'Parliamentary procedure and supply chain expert.' },
      { name: 'Anagha Krishna', bio: 'Parliamentary procedure and supply chain expert.' },
      { name: 'Pakhi Saini', bio: 'Parliamentary procedure and supply chain expert.' },
      { name: 'Joshitha Velmuragan', bio: 'Parliamentary procedure and public administration expert.' },
      { name: 'Navkiran Kaur', bio: 'Parliamentary procedure expert.' },
      { name: 'Noorpreet Kaur', bio: 'Parliamentary procedure expert.' },
      { name: 'Manu Nellapalle', bio: 'Parliamentary procedure expert.' },
      { name: 'Joseph Seong', bio: 'Parliamentary procedure expert.' },
      { name: 'Elijah Lee', bio: 'Parliamentary procedure and retail management expert.' },
      { name: 'Siddarth Saravananm', bio: 'Personal finance expert.' },
      { name: 'Ekansh Sen', bio: 'Personal finance and real estate expert.' },
      { name: 'Devin Shao', bio: 'Personal finance and securities expert.' },
      { name: 'Shreya Sharma', bio: 'Project management and sales presenter.' },
      { name: 'Gargi Sahoo', bio: 'Project management and securities expert.' },
      { name: 'Rigel Starks', bio: 'Project management expert.' },
      { name: 'Marniaa Shruti', bio: 'Public service announcement creator.' },
      { name: 'Ahana Ghatuparthi', bio: 'Public service announcement creator.' },
      { name: 'Ivana Philip', bio: 'Public service announcement creator.' },
      { name: 'Shijumita Kumar', bio: 'Public speaker and sales presenter.' },
      { name: 'Sahib baidwan', bio: 'Real estate expert.' },
      { name: 'Pranil shukla', bio: 'Real estate expert.' },
      { name: 'Muskan Sandhu', bio: 'Retail management and social media strategist.' },
      { name: 'Aaditya Perianna', bio: 'Retail management expert.' },
      { name: 'Shaurya Sahdev', bio: 'Sales presenter and website coder.' },
      { name: 'Rithwik Rajashekara', bio: 'Sales presenter and website designer.' },
      { name: 'Srihan Prasanna', bio: 'Sales presenter and technology support expert.' },
      { name: 'Samshi Chinthireddy', bio: 'Social media strategist and supply chain expert.' },
      { name: 'Dhriti Burugupalli', bio: 'Social media strategist and supply chain expert.' },
      { name: 'Harshi Abburi', bio: 'Social media strategist and website designer.' },
      { name: 'Ganishka Kuntumalla', bio: 'Social media strategist and sports management expert.' },
      { name: 'Bharvi Doshi', bio: 'Social media strategist.' },
      { name: 'Krithi Grandhe', bio: 'Sports management and visual designer.' },
      { name: 'Anaya Joshi', bio: 'Sports management expert.' },
      { name: 'Jay Thoohan', bio: 'Sports management expert.' },
      { name: 'Chandan Chengalvala', bio: 'Sports management and website coding expert.' },
      { name: 'Samiksha Anchuri', bio: 'Sports management and hospitality management expert.' },
      { name: 'Viraat Nellutla', bio: 'Technology support and website coding expert.' },
      { name: 'Sofia Zimbalist', bio: 'Visual designer.' },
      { name: 'Brandon Lin', bio: 'Visual designer and website designer.' },
      { name: 'Aditi Sehgal', bio: 'Public service announcement creator.' },
      { name: 'Alaina Kim', bio: 'Public service announcement creator.' },
      { name: 'Rishaan Das', bio: 'Website designer.' },
      { name: 'Saatvik Patel', bio: 'Website coder and website designer.' },
      { name: 'Aarish Kumar', bio: 'Securities and website design expert.' },
    ];

    // Event to members mapping
    const eventMembersMap: { [key: string]: string[] } = {
      'Accounting': ['Ashrit Kopparthi', 'Ian Mendonca', 'Aayush Pant', 'Atiksh Matharu', 'Liam Chang', 'Rohaan Pasha'],
      'Advanced Accounting': ['Sacchit Boddapati', 'Gautham Manigantan'],
      'Advertising': ['Niya Aslam', 'Deethya Anuga', 'Lucky Kadiam', 'Vienna Shin', 'Olivia Shin', 'Naman Agrawal'],
      'Agribusiness': ['Sprihi Sharma', 'Gabrielle Quiere', 'Ashmi Shah'],
      'Banking and Financial Systems': ['Samhitha Manukonda', 'Aman Kolli', 'Ian Mendonca', 'Saipranav Rebala', 'Brandon Osckar', 'Sameer Hussaini', 'Liam Chang', 'Shaurya Bansal', 'Arush Rasure'],
      'Broadcast Journalism': ['Shikha Prajapati', 'Niteesh AJ', 'Aashi Patel', 'Shriya Aroun', 'Rachel So', 'Anoushka Haloi', 'Natalie Ho', 'Saranya Potukuchi', 'Varalika Konduri', 'Saiprajna Ravooru', 'Shrita Kopparthi', 'Shaurya Bansal', 'Ved Dalvi', 'Varun Patwardhan', 'Rafail Popa', 'Khushi Bhimani', 'Anna Abraham'],
      'Business Communication': ['Kriyan Krishnan', 'Sahana Singh', 'Rohil Varshney', 'Shrita Kopparthi', 'Iman Siddiqui', 'Nitya Anand'],
      'Business Ethics': ['Amr Omar', 'Muhammad Koul', 'Adam Alaruri', 'Kashvi Arora', 'Ananya Mallick', 'Shrita Palla', 'Snigdha Sri Garlapati', 'Ellisandra Sou', 'Tanvi Kuttuva', 'Aashini Ramesh', 'Swarali Karale', 'Srianvika Siram'],
      'Business Law': ['Puranjay Wadhawan', 'Gayathri Priya Balla', 'Swati Premkumar', 'Saanvi Lankalapalli', 'Arush Rasure', 'Aahna Dattkaya', 'Shrita Palla'],
      'Business Management': ['Ayla Tamber', 'Rafail Popa', 'Keerth Kotha', 'Amogh Jain', 'Rajeev Kalagara', 'Nella Sharma', 'Amreen Dadwal', 'Elizabeth Tselyuk', 'Sashvitha Poobalan', 'Isabella Salazar', 'Abhi Kaki', 'Hei kan Tang', 'Arnav Verma'],
      'Business Plan': ['Vihaan Singh', 'Ruhaan Sidhu', 'Rayan Alam', 'Srianvika Siram', 'Anushree Gupta', 'Vilina Pai', 'Tanisha Chandel', 'Tanishka Yella', 'Avantika Santhosh', 'Prisha Sharma', 'Deethya Anuga', 'Ayush Balwalli', 'Kailani Fisher', 'Shahaan Dhebar', 'Aaric Das', 'Aarav Verma', 'Satvik Tadiparti'],
      'Career Portfolio': ['Sneha Nandkeolyar', 'Geethika Chandolu', 'Saswathy Srishankar', 'Jahnavi Shukla', 'Ali Mirza', 'Alisa Kyrychenko'],
      'Coding and Programming': ['Gautham Manigantan', 'Aayush Pant', 'Aadit Aggarwal', 'Rithvika Devisetti', 'Sayesha Rajbhandari', 'Gagana Rudra Bodala'],
      'Computer Applications': ['Sarthak Kansal', 'Riddhesh Jaini', 'Anvi Dua'],
      'Computer Game and Simulation Programming': ['Matthew Kokhan', 'Eric Luo', 'Srivats Iyer', 'Aryaman Rao', 'Abhinav Iyer', 'Dhanuh Bogam', 'Elina Shah', 'Ashrita Saravanan Vaishnavi'],
      'Computer Problem Solving': ['Aishwarya Kumaran', 'Mahima Iyer', 'Shubh Parihar', 'Akshar Parmar', 'Aditi Kesarwani', 'Ryan Cutinha', 'Ryan Wang'],
      'Customer Service': ['Meera Bhise', 'Maitree Chauhan', 'Megan Song', 'Sarah Chung', 'Nella Sharma', 'Krish Shah', 'Aanya Sheth'],
      'Cybersecurity': ['Feven Bizuayehu', 'Yusuf Abbasi', 'Ashrita Saravanan Vaishnavi', 'Ayla Mir', 'Adyan Ali', 'Mikul Pasupathi', 'Dhanuh Bogam', 'Vivaan Pole', 'Yuvin Agrawal'],
      'Data Analysis': ['Sprihi Sharma', 'Shaurya Gera', 'Sreshta Namala', 'Vanshika Kalluri', 'Nishtha Priya', 'Feven Bizuayehu', 'Pushkal Kumar', 'Guhan Thiagarajan', 'Sujan Saravanan', 'Vihaan Singh', 'Ruhaan Sidhu', 'Sidharth Vellanki', 'Abhinav Bonagiri', 'Saravana Jayavelu', 'Venkat Chandra', 'Neel Patel', 'Fiona Au', 'Ayla Mir'],
      'Data Science & AI': ['Ronit Agarwal', 'Satya Tumuluri', 'Vyom Joshi', 'Vidhyuth Rajesh Kanna', 'Sacchit Boddapati', 'Shreya Battula', 'Shaaz Alicherry', 'Devansh Ahuja', 'Rithwik Bhimanadhuni', 'Shaurya Gera', 'Shubh Parihar', 'Gyandeep Kintali', 'Yuvin Agrawal', 'Prisha Sharma'],
      'Digital Animation': ['Avisha Agrawal', 'Disha Pudakar', 'Saisha Agarwal', 'Oviya Raja', 'Arian Khaire', 'Krishna Chintalapati', 'Mikail Ahmed', 'Ishaan Agarwal'],
      'Digital Video Production': ['Kavya Subramanian', 'tarinika prasath', 'Saptaparna Dey', 'Joel Bijoy', 'Rishik Birru', 'Pranav Saravanan', 'Benjamin Xavier', 'Marcus Balauag', 'Rithwik Bhimanadhuni', 'Keyan Shah', 'Aadhav Iyer', 'Max Trepp', 'Rohil Varshney', 'Kriyan Krishnan', 'Pratyush Patnaik'],
      'Economics': ['Tasmia Minhaz', 'Vidhyuth Rajesh Kanna', 'Anisha Datta', 'Rayan Aziz', 'Nathan Dusapin', 'Satya Tumuluri'],
      'Entrepreneurship': ['Saahithi Mamillapalli', 'Julian Sieu', 'Sneha Nandkeolyar', 'Ajay Joshi', 'Aniruddh Gatla', 'Om Kharade', 'Kobee Tan', 'Shahaan Dhebar'],
      'Event Planning': ['Elisha Kim', 'Sabrina Castellanos French', 'Sinchana Vivek', 'Dhatri Achyutha', 'Nayana Surisetti', 'Varenya Pothukuchi', 'Ayla Tamber', 'Yasha Gatla', 'Aanya Sheth', 'Srianshi Samantaray', 'Rithika Pooboni', 'Quinlan Pradana', 'Aarav Patil', 'Aditi Kesarwani', 'Vamika Putane', 'Samvit Nadgouda', 'Aileen Putla', 'Ananya Mallick', 'Ritul Dwivedi', 'Sahana Senthilkumar', 'Angelika Prabhu', 'Sarah John', 'Andrea Chalissery'],
      'Financial Planning': ['Komalika Mamidi', 'Nandini Komma', 'Samhitha Nekkanty', 'Joshita Munnangi', 'Anshi Mehta', 'Anna Abraham', 'Srianshi Samantaray', 'Vyom Joshi', 'Devansh Agarwal', 'Aiden Sol', 'Nathan Son', 'Jeffrey Jiang'],
      'Financial Statement Analysis': ['Advaith Koushik', 'Anay Arya', 'Nishad Satghare', 'Anisha Datta', 'Snigdha Sri Garlapati', 'Matthew Song', 'Jaithra Putane', 'Pranav Saravanan', 'Marcus Balauag', 'Sarayu Nukala', 'Sanskriti Shukla', 'Anusha Date'],
      'Future Business Educator': ['Rishitha Sindogi', 'Sara Kansal', 'Benjamin Xavier', 'Anaya Borade', 'Kelly Mascarenhas', 'Shikha Prajapati'],
      'Future Business Leader': ['Venkat Chandra', 'Neel Patel', 'Mahima Iyer', 'Ishaan Regalla', 'Aradhna Praveen'],
      'Graphic Design': ['Tasmia Minhaz', 'Mahi Parikh', 'Saanvi Vijayvargiya', 'Ananya Gupta', 'Matthew Kokhan', 'Tej Simha Tummapudi', 'Kody Choi', 'Tanisha Chandel', 'Tanishka Yella', 'Rithika Pooboni', 'Gianna Canos', 'Sankari Kk', 'Ajooni Dhanoa', 'Andy Yang', 'Soumil Pole', 'Avni Panchal', 'Kavya Mohanasundaram', 'Eric Luo', 'Yunhan Li'],
      'Healthcare Administration': ['Sanjana Krishnan', 'Adam Alaruri', 'Dhatri Achyutha', 'Srinath Vemula', 'Ellena Wong', 'Ashmi Shah', 'Oviya Raja', 'Shravya More', 'Laya Mohan'],
      'Hospitality and Event Management': ['Katie Park', 'Anuva Shrestha', 'Vanshika Kalluri', 'Rebecca Li', 'Krishna Chintalapati', 'Aarav Mohindra', 'Samiksha Anchuri', 'Neev Popli', 'Prisha Mundra', 'Harp Brar', 'Joshua Yeo', 'Caleb Yeo', 'Edward Zhang'],
      'Human Resources Management': ['Pariza Nizam', 'Eliana Chung', 'Ellena Wong', 'Maitree Chauhan', 'Shruti Vinodkumar', 'Vilina Pai'],
      'Impromptu Speaking': ['Aiden Silva', 'Ronak Singh', 'Bhadra Pillai', 'Sarah Chung', 'Abhay Sankar', 'Ibrahim Ansari'],
      'Insurance and Risk Management': ['Abhinav Iyer', 'Ishaan Sharma', 'Pratyush Patnaik', 'Vivaan Singh', 'Charik Malik', 'Sameer Hussaini'],
      'International Business': ['Shaaz Alicherry', 'Ashrit Kopparthi', 'Ananya Gupta', 'Aniruddh Gatla', 'Yasha Gatla', 'Manvik Madupuru', 'Mehar Uppal', 'Ayushi Malla', 'Arul Saravanan'],
      'Intro to Business Communication': ['Niyati Rao', 'Sarthak Kansal', 'Dhriti Baireddy', 'Nishka Bansal', 'Tanvi Kuttuva', 'Vivaan Singh'],
      'Intro to Business Concepts': ['Vaibhu Lakkakula', 'Keerth Kotha', 'Kanak Aggarwal', 'Tanvi Kadiyala', 'Ronin Issa', 'Andrea Chalissery'],
      'Intro to Business Presentation': ['Krithikha Bharathy', 'Kavya Seshan', 'Vedant Gopalan', 'Arul Saravanan', 'Om Kharade', 'Jerry Qu', 'Rebecca Li', 'Sujan Saravanan', 'Sankeerth Vallapureddy', 'Samick Churi', 'Nandini Komma', 'Komalika Mamidi', 'Vanshi Patel', 'Vera Heng', 'Maithili Nadig', 'Sahithya Vellanki', 'Tanirika Koka', 'Aarna Vinay', 'Riya Ageeru', 'Saanvi Sahoo', 'Elizabeth Tselyuk', 'Gabrielle Quiere', 'Tanvi Kadiyala', 'Keely Fan', 'Natalie Ho', 'Devansh Ahuja', 'Mukil Pasupathi', 'Nikhil Tummapudi', 'Siddhanth Maurya', 'Aarush Shinu', 'Rehan Shaikh', 'Adhyan Rangole', 'Sammith Kuluru'],
      'Intro to Business Procedures': ['Ved Dalvi', 'Sankeerth Vallapureddy', 'Pranav Sharma', 'Atiksh Matharu', 'Ishita Ponnaganti', 'Nishka Bansal'],
      'Intro to FBLA': ['Akshita Burra', 'Akshat Kumar', 'Samvit Nadgouda', 'Yatee Makadia', 'Aarav Marok'],
      'Intro to Information Technology': ['Aarav Sharma', 'Anika Sharma', 'Adhu Manikandan', 'Avisha Agrawal', 'Shresta Srinivasa', 'Suluv Vaish'],
      'Intro to Marketing Concepts': ['Katie Park', 'Elisha Kim', 'Niya Aslam', 'Arnav Singh', 'Lasya Vadakuppa', 'Amy Deepu', 'Krish Shah'],
      'Intro to Parliamentary Procedure': ['Diya Patel', 'Ajay Joshi', 'Saisha Agarwal', 'Saanvi Lankalapalli'],
      'Intro to Programming': ['Shreya Battula', 'Shresta Srinivasa', 'Vedant Gopalan', 'Aarav Sharma', 'Advaith Koushik', 'Akshaya Nandigama', 'Tanisha Shankpal', 'Yo-Cheng Liao', 'Elina Shah', 'Devansh Agarwal', 'Reyansh Kuntawar', 'Rishi Kumpatla'],
      'Intro to Public Speaking': ['Samick Churi', 'Jerry Qu', 'Aiden Silva', 'Rajit Sen', 'Ayushi Malla', 'Suluv Vaish', 'Pranav Sharma', 'Dhriti Baireddy', 'Ali Mirza', 'Angelina Samuel'],
      'Intro to Retail and Merchandising': ['Aahna Dattkaya', 'Aarav Marok', 'Lalith Senthil', 'Satvik Tadiparti'],
      'Intro to Social Media Strategy': ['Reyansh Kuntawar', 'Connor Huang', 'Nita Swadesh', 'Tanirika Koka', 'Nayana Surisetti', 'Vanshi Patel', 'Arnav Singh', 'Muskaan Mathur', 'Evelyn Lee', 'Chloe Kao', 'Atishay Gupta', 'Micah Park', 'Amy Deepu', 'Niyati Rao', 'Maithili Nadig', 'Meenakshi Eashwar', 'Vivaan Pole', 'Amogh Murthy', 'Maaya Ramesh', 'Shayantam Singh', 'Aarin Hatkhamkar', 'Priyanna Naicker', 'Nikhita Panja'],
      'Intro to Supply Chain Management': ['Manish Vishnuram', 'Akshaini Yanamandra', 'Kayla Phan', 'Namya Thareja', 'Riddhesh Jaini', 'Aditya Chattopadhyay'],
      'Job Interview': ['Akshat Kumar', 'Saswathy Srishankar', 'Prakruthi Venugopalan', 'Manvik Madupuru', 'Calvin Widjaja', 'Khushi Bhimani'],
      'Journalism': ['Gayathri Priya Balla', 'Nitya Anand', 'Arham Tanweer'],
      'Management Information Systems': ['Advaith Voodem', 'Rishi Khante', 'Aanya Rawal', 'Yo-cheng Liao', 'Andy Zhang', 'Aadhya Goyal'],
      'Marketing': ['Eliana Chung', 'Alisha Verma', 'Saahithi Mamillapalli', 'Mehar Uppal', 'Kanak Aggarwal', 'Edward Zhang', 'Megan Song', 'Minh Nguyen', 'Nivedita Saju Menon', 'Samhith Kotapalle'],
      'Mobile Application Development': ['Aadit Aggarwal', 'Ritvik Bansal', 'Satwik Mannepalli', 'Lalith Senthil', 'Keyan Shah', 'Gordon Zhang', 'Sarayu Nukala', 'Ryan Wang', 'Pushkal Kumar'],
      'Network Design': ['Vaibhu Lakkakula', 'Tanisha Shankpal', 'Anay Arya', 'Matthew Song', 'Nishad Satghare', 'Anvith Neelam', 'Rishi Khante', 'Gordon Zhang', 'Sidharth Vellanki', 'Abhinav Bonagiri'],
      'Networking Infrastructures': ['Ryan Cutinha', 'Guhan Thiagarajan', 'Sybe Hofman', 'Nishtha Priya'],
      'Organizational Leadership': ['Siyona Sharma', 'Kashvi Arora', 'Pariza Nizam'],
      'Parliamentary Procedure': ['Samya Sharma', 'Prisha Mundra', 'Aneri Bhatt', 'Harp Brar', 'Anagha Krishna', 'Pakhi Saini', 'Shruti Vinodkumar', 'Rishitha Sindogi', 'Joshitha Velmuragan', 'Aashi Patel', 'Shriya Aroun', 'Rachel So', 'Gianna Canos', 'Minh Nguyen', 'Navkiran Kaur', 'Noorpreet Kaur', 'Nivedita Saju Menon', 'Advaith Voodem', 'Manu Nellapalle', 'Ronak Singh', 'Ritvik Bansal', 'Ibrahim Ansari', 'Joseph Seong', 'Elijah Lee', 'Caleb Yeo', 'Connor Huang'],
      'Personal Finance': ['Nathan Dusapin', 'Rayan Aziz', 'Siddarth Saravananm', 'Ekansh Sen', 'Devin Shao', 'Mikail Ahmed', 'Brandon Osckar', 'Jeffrey Jiang', 'Rohaan Pasha'],
      'Project Management': ['Anaya Borade', 'Calvin Widjaja', 'Shreya Sharma', 'Gargi Sahoo', 'Charik Malik', 'Rigel Starks'],
      'Public Administration and Management': ['Arham Tanweer', 'Sanskriti Shukla', 'Joshitha Velmurugan'],
      'Public Service Announcement': ['Fiona Au', 'Alaina Kim', 'Kody Choi', 'Jaithra Putane', 'Aditi Sehgal', 'Saranya Potukuchi', 'Diya Patel', 'Marniaa Shruti', 'Ahana Ghatuparthi', 'Ivana Philip', 'Anoushka Haloi'],
      'Public Speaking': ['Shijumita Kumar', 'Neev Popli', 'Sankari Kk', 'Meenakshi Eashwar', 'Saiprajna Ravooru', 'Sreshta Namala', 'Abhay Sankar', 'Ritul Dwivedi'],
      'Real Estate': ['Sahib baidwan', 'Srinath Vemula', 'Ekansh Sen', 'Amreen Dadwal', 'Ishaan Regalla', 'Pranil shukla'],
      'Retail Management': ['Sahana Singh', 'Muskan Sandhu', 'Elijah Lee', 'Rajit Sen', 'Aaditya Perianna'],
      'Sales Presentation': ['Siyona Sharma', 'Kavya Subramanian', 'Lucky Kadiam', 'Shaurya Sahdev', 'Julian Sieu', 'Rishi Kumpatla', 'Adyan Ali', 'Sinchana Vivek', 'Rithwik Rajashekara', 'Shijumita Kumar', 'Anika Sharma', 'Lasya Vadakuppa', 'Srihan Prasanna', 'Samhith Kotapalle', 'Iman Siddiqui', 'Shreya Sharma'],
      'Securities and Investments': ['tarinika prasath', 'Devin Shao', 'Aarish Kumar', 'Kayla Phan', 'Gargi Sahoo', 'Mahi Parikh'],
      'Social Media Strategies': ['Geethika Chandolu', 'Bharvi Doshi', 'Muskan Sandhu', 'Samshi Chinthireddy', 'Dhriti Burugupalli', 'Harshi Abburi', 'Ganishka Kuntumalla', 'Anushree Gupta', 'Sanjana Krishnan', 'Shravya More', 'Sara Kansal', 'Joshua Yeo', 'Aiden Sol', 'Nathan Son', 'Samhitha Nekkanty', 'Joshita Munnangi', 'Anshi Mehta', 'Aradhna Praveen', 'Sashvitha Poobalan', 'Isabella Salazar', 'Sarah John'],
      'Sports and Entertainment Management': ['Akshita Burra', 'Ganishka Kuntumalla', 'Ayush Balwalli', 'Kailani Fisher', 'Arian Khaire', 'Aarav Patil', 'Jay Thoohan', 'Meera Bhise', 'Krithi Grandhe', 'Saravana Jayavelu', 'Chandan Chengalvala', 'Samiksha Anchuri', 'Anaya Joshi', 'Kelly Mascarenhas'],
      'Supply Chain Management': ['Manish Vishnuram', 'Samshi Chinthireddy', 'Dhriti Burugupalli', 'Anagha Krishna', 'Aneri Bhatt', 'Samya Sharma', 'Atishay Gupta', 'Micah Park', 'Sameer Hussaini', 'Liam Chang', 'Pakhi Saini', 'Aman Kolli', 'Anusha Date', 'Saipranav Rebala', 'Aryaman Rao'],
      'Technology Support Services': ['Viraat Nellutla', 'Satwik Mannepalli', 'Srihan Prasanna', 'Naman Agrawal'],
      'Visual Design': ['Saanvi Vijayvargiya', 'Varenya Pothukuchi', 'Ishita Ponnaganti', 'Sofia Zimbalist', 'Samhitha Manukonda', 'Angie Prabhu', 'Sahana Senthilkumar', 'Brandon Lin', 'Ajooni Dhanoa', 'Avni Panchal', 'Kavya Mohanasundaram', 'Alisha Verma', 'Krithi Grandhe'],
      'Website Coding and Development': ['Rayan Alam', 'Ronit Agarwal', 'Shaurya Sahdev', 'Aanya Rawal', 'Aishwarya Kumaran', 'Aadhya Goyal', 'Anvith Neelam', 'Viraat Nellutla', 'Chandan Chengalvala', 'Rithvika Devisetti', 'Sayesha Rajbhandari', 'Sybe Hofman', 'Saatvik Patel', 'Tej Simha Tummapudi', 'Joel Bijoy', 'Rishik Birru', 'Alisa Kyrychenko', 'Anvi Dua', 'Gagana Rudra Bodala'],
      'Website Design': ['Amogh Jain', 'Akshar Parmar', 'Ishaan Agarwal', 'Yunhan Li', 'Swarali Karale', 'Aarish Kumar', 'Yusuf Abbasi', 'Saatvik Patel', 'Andy Yang', 'Rithwik Rajashekara', 'Soumil Pole', 'Harshi Abburi', 'Brandon Lin', 'Aileen Putla', 'Prakruthi Venugopalan', 'Rishaan Das'],
    };

    // Generate initials and email for each member
    const membersWithInitials = membersData.map((member, index) => {
      // Generate a safe email from the name
      const emailName = member.name.toLowerCase().replace(/\s+/g, '.');
      return {
        ...member,
        initials: member.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        email: `${emailName}@fbla.example.com`
      };
    });

    // Insert members
    const { data: insertedMembers, error: membersInsertError } = await supabase
      .from('fbla_members')
      .insert(membersWithInitials)
      .select();

    if (membersInsertError) {
      console.error('Error inserting members:', membersInsertError);
      return;
    }

    console.log(`Inserted ${insertedMembers?.length} members`);

    // Insert events
    const eventNames = Object.keys(eventMembersMap);
    const eventsToInsert = eventNames.map(name => ({ name }));

    const { data: insertedEvents, error: eventsInsertError } = await supabase
      .from('fbla_events')
      .insert(eventsToInsert)
      .select();

    if (eventsInsertError) {
      console.error('Error inserting events:', eventsInsertError);
      return;
    }

    console.log(`Inserted ${insertedEvents?.length} events`);

    // Create member-event relationships
    const memberEventRelationships: { member_id: string; event_id: string }[] = [];

    for (const event of insertedEvents || []) {
      const memberNames = eventMembersMap[event.name] || [];
      
      for (const memberName of memberNames) {
        const member = insertedMembers?.find(m => m.name === memberName);
        if (member) {
          memberEventRelationships.push({
            member_id: member.id,
            event_id: event.id
          });
        }
      }
    }

    // Insert member-event relationships in batches
    const batchSize = 100;
    for (let i = 0; i < memberEventRelationships.length; i += batchSize) {
      const batch = memberEventRelationships.slice(i, i + batchSize);
      const { error: relationshipsError } = await supabase
        .from('fbla_member_events')
        .insert(batch);

      if (relationshipsError) {
        console.error('Error inserting member-event relationships:', relationshipsError);
      }
    }

    console.log(`Inserted ${memberEventRelationships.length} member-event relationships`);
    console.log('Members database seeded successfully!');
  } catch (error) {
    console.error('Error seeding members database:', error);
  }
};
