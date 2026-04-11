"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/components/auth/AuthContext"
import GoogleAuthButton from "@/components/auth/GoogleAuthButton"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

type FormData = {
    fullName: string
    dob: string
    gender: string
    phone: string
    email: string
    street: string
    city: string
    state: string
    zip: string
    country: string
    username: string
    password: string
    confirmPassword: string
}

const initialForm: FormData = {
    fullName: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    username: "",
    password: "",
    confirmPassword: "",
}

type Errors = Partial<Record<keyof FormData, string>>

export default function RegisterPage() {
    const { register: authRegister } = useAuth()
    const [form, setForm] = useState<FormData>(initialForm)
    const [errors, setErrors] = useState<Errors>({})
    const [authError, setAuthError] = useState("")
    const [submitted, setSubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [profilePreview, setProfilePreview] = useState<string | null>(null)
    const [idProofName, setIdProofName] = useState<string | null>(null)
    const profileRef = useRef<HTMLInputElement>(null)
    const idRef = useRef<HTMLInputElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        if (errors[e.target.name as keyof FormData]) {
            setErrors({ ...errors, [e.target.name]: undefined })
        }
    }

    const handleProfilePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => setProfilePreview(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    const handleIdProof = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) setIdProofName(file.name)
    }

    const getPasswordStrength = (pw: string) => {
        if (pw.length === 0) return { label: "", color: "", bg: "", width: "0%" }
        if (pw.length < 6) return { label: "Weak", color: "text-red-500", bg: "bg-red-500", width: "33%" }
        const hasUpper = /[A-Z]/.test(pw)
        const hasNumber = /[0-9]/.test(pw)
        const hasSpecial = /[^A-Za-z0-9]/.test(pw)
        const score = [hasUpper, hasNumber, hasSpecial, pw.length >= 8].filter(Boolean).length
        if (score <= 1) return { label: "Weak", color: "text-red-500", bg: "bg-red-500", width: "33%" }
        if (score <= 2) return { label: "Medium", color: "text-yellow-500", bg: "bg-yellow-500", width: "66%" }
        return { label: "Strong", color: "text-green-500", bg: "bg-green-500", width: "100%" }
    }

    const validate = (): boolean => {
        const e: Errors = {}
        if (!form.fullName.trim()) e.fullName = "Full name is required"
        if (!form.dob) e.dob = "Date of birth is required"
        if (!form.gender) e.gender = "Please select gender"
        if (!form.phone.trim()) e.phone = "Phone is required"
        else if (!/^\d{10}$/.test(form.phone.trim())) e.phone = "Enter a valid 10-digit phone number"
        if (!form.email.trim()) e.email = "Email is required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter a valid email"
        if (!form.street.trim()) e.street = "Street address is required"
        if (!form.city.trim()) e.city = "City is required"
        if (!form.state.trim()) e.state = "State is required"
        if (!form.zip.trim()) e.zip = "ZIP code is required"
        if (!form.country.trim()) e.country = "Country is required"
        if (!form.username.trim()) e.username = "Username is required"
        else if (form.username.trim().length < 3) e.username = "Username must be at least 3 characters"
        if (!form.password) e.password = "Password is required"
        else if (form.password.length < 6) e.password = "Password must be at least 6 characters"
        if (!form.confirmPassword) e.confirmPassword = "Please confirm password"
        else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match"
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setAuthError("")
        if (!validate()) {
            return
        }

        setSubmitting(true)
        const err = await authRegister({
            fullName: form.fullName,
            username: form.username,
            email: form.email,
            password: form.password,
        })

        if (err) {
            setAuthError(err)
            setSubmitting(false)
            return
        }

        setSubmitted(true)
        setTimeout(() => {
            window.location.href = "/"
        }, 1500)
    }

    const handleReset = () => {
        setForm(initialForm)
        setErrors({})
        setSubmitted(false)
        setSubmitting(false)
        setProfilePreview(null)
        setIdProofName(null)
        if (profileRef.current) profileRef.current.value = ""
        if (idRef.current) idRef.current.value = ""
    }

    const strength = getPasswordStrength(form.password)

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            <Navbar />

            {/* HERO */}
            <section className="py-12 text-center">
                <h2 className="text-4xl font-serif font-bold mb-2">Create Your Account</h2>
                <p className="text-muted-foreground">Join our community of art enthusiasts</p>
            </section>

            {/* FORM */}
            <section className="pb-20">
                <div className="container mx-auto px-4 max-w-3xl">
                    {submitted ? (
                        <Card className="p-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-green-500 text-white text-3xl flex items-center justify-center mx-auto mb-5">
                                ✓
                            </div>
                            <h3 className="text-2xl font-serif font-bold mb-2">Registration Successful!</h3>
                            <p className="text-muted-foreground mb-6">
                                Welcome, <strong>{form.fullName}</strong>! Redirecting you to the store...
                            </p>
                        </Card>
                    ) : (
                        <Card className="p-8">
                            <div className="mb-6 space-y-4">
                                <GoogleAuthButton nextPath="/">Sign up with Google</GoogleAuthButton>
                                <div className="relative text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    <span className="bg-white px-3 relative z-10">or</span>
                                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-border" />
                                </div>
                            </div>
                            {authError && (
                                <div className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded border border-red-200">
                                    {authError}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} noValidate>
                                {/* Personal Info */}
                                <SectionHeading text="Personal Information" />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} placeholder="John Doe" required />
                                    <Field label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} error={errors.dob} required />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">
                                            Gender <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="gender"
                                            value={form.gender}
                                            onChange={handleChange}
                                            className={`w-full border rounded px-3 py-2.5 text-sm bg-background ${errors.gender ? "border-red-500" : "border-input"}`}
                                        >
                                            <option value="">Select</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                        {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                                    </div>
                                    <Field label="Phone Number" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="9876543210" required />
                                </div>

                                <div className="mt-4">
                                    <Field label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" required />
                                </div>

                                {/* Address */}
                                <SectionHeading text="Address Details" />

                                <Field label="Street Address" name="street" value={form.street} onChange={handleChange} error={errors.street} placeholder="123 Main Street" required />

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                    <Field label="City" name="city" value={form.city} onChange={handleChange} error={errors.city} placeholder="Mumbai" required />
                                    <Field label="State" name="state" value={form.state} onChange={handleChange} error={errors.state} placeholder="Maharashtra" required />
                                    <Field label="ZIP Code" name="zip" value={form.zip} onChange={handleChange} error={errors.zip} placeholder="400001" required />
                                </div>

                                <div className="mt-4">
                                    <Field label="Country" name="country" value={form.country} onChange={handleChange} error={errors.country} placeholder="India" required />
                                </div>

                                {/* Uploads */}
                                <SectionHeading text="Uploads (Optional)" />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Profile Photo</label>
                                        <div
                                            className="w-full h-28 border-2 border-dashed border-input rounded-lg flex items-center justify-center cursor-pointer overflow-hidden bg-muted/30 hover:border-foreground/30 transition-colors"
                                            onClick={() => profileRef.current?.click()}
                                        >
                                            {profilePreview ? (
                                                <img src={profilePreview} alt="preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-sm text-muted-foreground">📷 Click to upload</span>
                                            )}
                                        </div>
                                        <input ref={profileRef} type="file" accept="image/*" onChange={handleProfilePhoto} className="hidden" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">ID Proof</label>
                                        <div
                                            className="w-full h-28 border-2 border-dashed border-input rounded-lg flex items-center justify-center cursor-pointer bg-muted/30 hover:border-foreground/30 transition-colors"
                                            onClick={() => idRef.current?.click()}
                                        >
                                            <span className="text-sm text-muted-foreground">
                                                {idProofName ? `📄 ${idProofName}` : "📄 Click to upload"}
                                            </span>
                                        </div>
                                        <input ref={idRef} type="file" accept="image/*,.pdf" onChange={handleIdProof} className="hidden" />
                                    </div>
                                </div>

                                {/* Account */}
                                <SectionHeading text="Account Credentials" />

                                <Field label="Username" name="username" value={form.username} onChange={handleChange} error={errors.username} placeholder="johndoe123" required />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className={`w-full border rounded px-3 py-2.5 text-sm bg-background ${errors.password ? "border-red-500" : "border-input"}`}
                                        />
                                        {form.password && (
                                            <>
                                                <div className="h-1 rounded bg-muted mt-2">
                                                    <div className={`h-full rounded ${strength.bg} transition-all duration-300`} style={{ width: strength.width }} />
                                                </div>
                                                <span className={`text-xs ${strength.color}`}>{strength.label}</span>
                                            </>
                                        )}
                                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                    </div>
                                    <Field label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} placeholder="••••••••" required />
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                                    <Button type="button" variant="outline" onClick={handleReset}>
                                        Reset
                                    </Button>
                                    <Button type="submit" disabled={submitting}>
                                        {submitting ? "Creating Account..." : "Create Account"}
                                    </Button>
                                </div>
                            </form>

                            <div className="text-center mt-6 text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/login" className="text-foreground font-semibold underline">
                                    Sign In
                                </Link>
                            </div>
                        </Card>
                    )}
                </div>
            </section>
            
            <Footer />
        </div>
    )
}

/* ─── Reusable Sub-components ─── */

function SectionHeading({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3 mt-8 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{text}</span>
            <div className="flex-1 h-px bg-border" />
        </div>
    )
}

function Field({
    label,
    name,
    value,
    onChange,
    error,
    type = "text",
    placeholder = "",
    required = false,
}: {
    label: string
    name: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    error?: string
    type?: string
    placeholder?: string
    required?: boolean
}) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1.5">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full border rounded px-3 py-2.5 text-sm bg-background ${error ? "border-red-500" : "border-input"}`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    )
}
