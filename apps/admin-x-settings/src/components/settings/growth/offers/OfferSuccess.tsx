import {Button} from '@tryghost/admin-x-design-system';
import {Icon} from '@tryghost/admin-x-design-system';
import {Modal} from '@tryghost/admin-x-design-system';
import {Offer, useBrowseOffersById} from '@tryghost/admin-x-framework/api/offers';
import {getHomepageUrl} from '@tryghost/admin-x-framework/api/site';
import {useEffect, useState} from 'react';
import {useGlobalData} from '../../../providers/GlobalDataProvider';
import {useRouting} from '@tryghost/admin-x-framework/routing';

const OfferSuccess: React.FC<{id: string}> = ({id}) => {
    const {updateRoute} = useRouting();
    const {data: {offers: offerById = []} = {}} = useBrowseOffersById(id ? id : '');

    const [offer, setOffer] = useState<Offer>();
    const [offerLink, setOfferLink] = useState<string>('');

    const {siteData} = useGlobalData();

    useEffect(() => {
        if (offerById.length > 0) {
            const currentOffer = offerById[0];
            const offerUrl = `${getHomepageUrl(siteData!)}${currentOffer?.code}`;
            setOfferLink(offerUrl);
            setOffer(currentOffer);
        }
    }, [offerById, siteData]);

    const [isCopied, setIsCopied] = useState(false);

    const handleCopyClick = async () => {
        try {
            await navigator.clipboard.writeText(offerLink);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1000); // reset after 1 seconds
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to copy text: ', err);
        }
    };

    const handleTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURI(offerLink)}&text=${encodeURIComponent(offer?.name || '')}`, '_blank');
    };

    const handleFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURI(offerLink)}`, '_blank');
    };

    const handleLinkedIn = () => {
        window.open(`http://www.linkedin.com/shareArticle?mini=true&url=${encodeURI(offerLink)}&title=${encodeURIComponent(offer?.name || '')}`, '_blank');
    };

    return <Modal
        afterClose={() => {
            updateRoute('offers');
        }}
        animate={false}
        footer={false}
        height='full'
        size='lg'
        topRightContent='close'
    >
        <div className='-mt-6 flex h-full flex-col items-center justify-center text-center'>
            <Icon name='tags-check' size='xl' />
            <h1 className='mt-6 text-4xl'>Your new offer is live!</h1>
            <p className='mt-3 max-w-[510px] text-[1.6rem]'>You can share the link anywhere. In your newsletter, social media, a podcast, or in-person. It all just works.</p>
            <div className='mt-8 flex w-full max-w-md flex-col gap-8'>
                <Button color='green' label={isCopied ? 'Copied!' : 'Copy link'} fullWidth onClick={handleCopyClick} />
                <div className='flex items-center gap-4 text-xs font-medium before:h-px before:grow before:bg-grey-300 before:content-[""] after:h-px after:grow after:bg-grey-300 after:content-[""]'>OR</div>
                <div className='flex gap-2'>
                    <Button className='h-8 border border-grey-300' icon='twitter-x' iconColorClass='w-[14px] h-[14px]' size='sm' fullWidth onClick={handleTwitter} />
                    <Button className='h-8 border border-grey-300' icon='facebook' size='sm' fullWidth onClick={handleFacebook} />
                    <Button className='h-8 border border-grey-300' icon='linkedin' size='sm' fullWidth onClick={handleLinkedIn} />
                </div>
            </div>
        </div>
    </Modal>;
};

export default OfferSuccess;