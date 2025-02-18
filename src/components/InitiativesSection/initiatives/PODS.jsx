import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useDisclosure } from '@mantine/hooks';
import { Title, Text, Box, Flex, Button, Modal } from '@mantine/core';
import { PodsLogo, IconLogo, C3PartnerLogo, HHPartnerLogo } from '@assets';
import { useCommonStyles } from './styles';
import dayjs from '@utils/day';
import { store } from '@services/firebase';

const PODS = () => {
    const { classes } = useCommonStyles();
    const [opened, { open, close }] = useDisclosure(false);
    const [data, setData] = useState({
        applicable: false,
        openDate: 'TBD',
        description: '',
        typeform: '',
    });

    const getData = async () => {
        try {
            const docSnap = await getDoc(doc(store, 'initiatives', 'pods'));
            if (docSnap.exists()) {
                const docData = docSnap.data();
                const date = docData.openDate.toDate();
                setData({
                    applicable: docData.applicable,
                    openDate: dayjs(date).format('MMMM Do, YYYY'),
                    description: docData.description,
                    typeform: docData.typeform,
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Box
            sx={(theme) => ({
                boxShadow: theme.shadows.lg,
            })}
        >
            <Box className={classes.outerBox}>
                <Box className={classes.innerBox}>
                    <Flex
                        justify="center"
                        align="center"
                        gap={12}
                        className={classes.partnerLogoContainer}
                    >
                        <img
                            alt="LCS Logo"
                            src={IconLogo}
                            className={classes.lcsLogo}
                        />
                        <img
                            alt="HawkHacks Logo"
                            src={HHPartnerLogo}
                            className={classes.hhLogo}
                        />
                        <img
                            alt="C Cubed Logo"
                            src={C3PartnerLogo}
                            className={classes.c3Logo}
                        />
                    </Flex>
                    <Title className={classes.title}>LCS PODS</Title>
                    <Flex
                        justify="center"
                        align="center"
                        className={classes.headerLogoBox}
                    >
                        <Box
                            sx={(theme) => ({
                                display: 'none',

                                [theme.fn.smallerThan('md')]: {
                                    display: 'block',
                                },
                            })}
                        >
                            <img
                                src={PodsLogo}
                                alt="PODS Logo"
                                className={classes.headerLogo}
                            />
                        </Box>
                    </Flex>
                </Box>
                <Flex
                    sx={(theme) => ({
                        gap: 32,
                        [theme.fn.smallerThan('sm')]: {
                            gap: 0,
                        },
                    })}
                    direction="row-reverse"
                >
                    <Flex align="center">
                        <Text className={classes.description}>
                            {data.description}
                        </Text>
                    </Flex>
                    <Flex align="center">
                        <img
                            src={PodsLogo}
                            alt="PODS Logo"
                            className={classes.bodyLogo}
                        />
                    </Flex>
                </Flex>
                {!data.applicable && (
                    <Text className={classes.smallText}>
                        {`Applications open on ${data.openDate}`}
                    </Text>
                )}
                <Flex mt="2rem" gap="md" className={classes.actionBox}>
                    <span className="sr-only" id="pods-details">
                        opens a modal with more description about PODS
                    </span>
                    <Button
                        aria-describedby="pods-details"
                        size="lg"
                        variant="subtle"
                        onClick={open}
                    >
                        Show More
                    </Button>
                    {data.applicable && (
                        <Box>
                            <span className="sr-only" id="apply-pods">
                                opens form to apply to PODS
                            </span>
                            <Button
                                component="a"
                                href={data.typeform}
                                aria-describedby="apply-pods"
                                variant="gradient"
                                gradient={{
                                    from: 'blue.4',
                                    to: 'accents.1',
                                }}
                                className={classes.actionBtn}
                                size="lg"
                                disabled={!data.applicable}
                            >
                                Apply
                            </Button>
                        </Box>
                    )}
                </Flex>
            </Box>
            <Modal
                opened={opened}
                onClose={close}
                title="LCS PODS Details"
                size="85%"
                centered
            >
                <Box
                    sx={{
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        color: 'white',
                    }}
                >
                    <p>
                        PODS has 5 major development phases -{' '}
                        <span className="bold">
                            Brainstorming, Design, Prototyping, MVP
                        </span>{' '}
                        and <span className="bold">Launch</span>.
                    </p>
                    <p>
                        PODS teams are curated based on skill level, based on
                        your application's test. Our goal is for{' '}
                        <span className="bold">everyone to learn</span> - not
                        just one hardcarry.
                    </p>
                    <p>
                        Each POD will work on one project over the course of the
                        next three months. These projects can be{' '}
                        <span className="bold">websites</span>
                        ,&nbsp;<span className="bold">video games</span>,&nbsp;
                        <span className="bold">machine learning models</span>
                        ,&nbsp;or whatever else the team is interested in!
                    </p>
                </Box>
            </Modal>
        </Box>
    );
};

export default PODS;
