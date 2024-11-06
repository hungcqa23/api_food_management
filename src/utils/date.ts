import moment from 'moment';

export interface CourseData {
  dateOfStart: string;
  numberOfSessions: number;
  weeklySchedule: string[];
  dates: string[];
}

export function calculateEndDate(courseData: CourseData): string {
  const { dateOfStart, numberOfSessions, weeklySchedule, dates } = courseData;

  // Parse the start date using moment
  const startDate = moment(dateOfStart, 'DD/MM/YYYY');

  let currentDate = startDate.clone();

  let sessionCount = 0;

  while (sessionCount < numberOfSessions) {
    const dayOfWeek = currentDate.format('dddd');
    const scheduleForDay = weeklySchedule.find(schedule => {
      const days = schedule.split(' ');
      return days[0] === dayOfWeek;
    });

    if (scheduleForDay) {
      dates.push(currentDate.format('DD/MM/YYYY'));
      ++sessionCount;
    }

    if (sessionCount === numberOfSessions) {
      return currentDate.format('DD/MM/YYYY');
    }
    currentDate.add(1, 'days');
  }
  // Format the final date using moment
  const formattedEndDate = currentDate.format('DD/MM/YYYY');
  return formattedEndDate;
}
