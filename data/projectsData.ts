export interface Project {
  slug: string;
  title: string;
  description: string;
  category: string;
  image: string;
}

export const projectsData: Project[] = [
  {
    slug: 'layihe-1',
    title: 'Müasir Yaşayış Kompleksi',
    description: 'Bakıda müasir yaşayış kompleksinin tikintisi və dizaynı',
    category: 'Tikinti',
    image: '/images/projects/project-1.jpg',
  },
  {
    slug: 'layihe-2',
    title: 'Ofis Binası Təmir',
    description: 'Kommersiya binasının tam təmir və yenilənməsi',
    category: 'Təmir',
    image: '/images/projects/project-2.jpg',
  },
  {
    slug: 'layihe-3',
    title: 'Lift Quraşdırılması',
    description: 'Çoxmərtəbəli binada lift sisteminin quraşdırılması',
    category: 'Lift',
    image: '/images/projects/project-3.jpg',
  },
  {
    slug: 'layihe-4',
    title: 'Cam Balkon Sistemləri',
    description: 'Müasir cam balkon sistemlərinin quraşdırılması',
    category: 'Şüşə Sistemləri',
    image: '/images/projects/project-4.jpg',
  },
];

