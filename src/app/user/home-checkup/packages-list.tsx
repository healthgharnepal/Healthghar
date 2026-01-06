'use client'

import { useState } from 'react'
import BookingModal from './booking-modal'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

type Package = {
    id: string
    title: string
    price: number
    description: string
}

export default function PackagesList({ packages, userProfile }: { packages: Package[], userProfile: any }) {
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)

    // Split description into features list if possible, or just use as text
    const getFeatures = (desc: string) => {
        return desc.split('\n').filter(line => line.trim().length > 0)
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {packages?.map((pkg, index) => (
                    <motion.div
                        key={pkg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="h-full"
                    >
                        <Card className="h-full flex flex-col border-white/20 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                            <CardHeader className="p-3 md:p-4">
                                <CardTitle className="text-base md:text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">{pkg.title}</CardTitle>
                                <CardDescription className="flex flex-col md:flex-row md:items-baseline gap-0.5 md:gap-1 mt-1">
                                    <span className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">Rs. {pkg.price}</span>
                                    <span className="text-[10px] md:text-xs text-muted-foreground">/ session</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 p-3 pt-0 md:p-4 md:pt-0">
                                <div className="space-y-1.5 md:space-y-2">
                                    {getFeatures(pkg.description).map((feature, i) => (
                                        <div key={i} className="flex items-start gap-1.5 md:gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-300">
                                            <Check className="h-3 w-3 md:h-4 md:w-4 text-green-500 mt-0.5 shrink-0" />
                                            <span className="line-clamp-2">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="p-3 md:p-4 border-t bg-gray-50/50 dark:bg-black/20">
                                <Button
                                    className="w-full font-semibold shadow-md bg-gray-900 hover:bg-gray-800 text-white h-8 text-xs md:h-10 md:text-sm"

                                    onClick={() => setSelectedPackage(pkg)}
                                >
                                    Book <ArrowRight className="ml-1.5 h-3 w-3 md:ml-2 md:h-4 md:w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}

                {(!packages || packages.length === 0) && (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl bg-gray-50/50">
                        <p className="text-lg font-medium text-gray-900">No packages available</p>
                        <p className="text-muted-foreground">Please check back later for new home checkup packages.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedPackage && (
                <BookingModal
                    pkg={selectedPackage}
                    userProfile={userProfile}
                    onClose={() => setSelectedPackage(null)}
                />
            )}
        </>
    )
}
