<?php

namespace Bundle\MainBundle\Form\Filter;

use Bundle\AnnotationLogBundle\Entity\ActionLog;
use Doctrine\Bundle\DoctrineBundle\Registry;
use Lexik\Bundle\FormFilterBundle\Filter\Form\Type\ChoiceFilterType;
use Lexik\Bundle\FormFilterBundle\Filter\Form\Type\DateTimeRangeFilterType;
use Lexik\Bundle\FormFilterBundle\Filter\Form\Type\TextFilterType;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * Class ActionLogFilterType
 *
 * @package Bundle\MainBundle\Form\Filter
 */
class ActionLogFilterType extends AbstractType
{
    private $doctrine;
    private $container;

    /**
     * Constructor
     *
     * @param Registry           $doctrine
     * @param ContainerInterface $container
     */
    public function __construct(Registry $doctrine, ContainerInterface $container)
    {
        $this->doctrine = $doctrine;
        $this->container = $container;
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add(
                'ip',
                TextFilterType::class,
                [
                    'label' => 'Ip',
                    'attr' => [
                        'placeholder' => 'actionlogs.placeholder.IP',
                        'translateLabel' => 'actionlogs.IP',
                    ],
                ]
            )
            ->add(
                'method',
                ChoiceFilterType::class,
                [
                    'label' => 'Method',
                    'choices' => ActionLog::getMethods(),
                    'empty_value' => 'admin.general.SELECT',
                    'attr' => [
                        'translateLabel' => 'actionlogs.METHOD',
                    ],
                ]
            )
            ->add(
                'path',
                TextFilterType::class,
                [
                    'label' => 'Path',
                    'attr' => [
                        'placeholder' => 'actionlogs.placeholder.PATH',
                        'translateLabel' => 'actionlogs.PATH',
                    ],
                ]
            )
            ->add(
                'application',
                ChoiceFilterType::class,
                [
                    'choices' => $this->doctrine->getManager()->getRepository('MainBundle:Application')->getNamesArray(),
                    'multiple' => false,
                    'label' => 'Application',
                    'empty_value' => 'admin.general.SELECT',
                    'attr' => [
                        'translateLabel' => 'actionlogs.APPLICATION',
                    ],
                ]
            )
            ->add(
                'user',
                ChoiceFilterType::class,
                [
                    'choices' => $this->doctrine->getManager()->getRepository('UserBundle:User')->getNamesArray(),
                    'multiple' => false,
                    'label' => 'User',
                    'empty_value' => 'admin.general.SELECT',
                    'attr' => [
                        'translateLabel' => 'actionlogs.USER',
                    ],
                ]
            )
        ;
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'csrf_protection'   => false,
                'validation_groups' => [
                    'filtering',
                ],
            ]
        );
    }
}
