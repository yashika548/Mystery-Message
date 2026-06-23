import{z} from'zod'

export const verifySchema = z.object({
    code: z.string().length(6,'Verfication coe must be 6 digit')
})