import { supabase } from './packages/supabase/src/client'

async function testQuery() {
    const { data, error } = await supabase
        .from('assignment_submissions')
        .select(`
            *,
            profiles:student_id(full_name, matric_number)
        `)

    console.log('Data:', data)
    console.log('Error:', error)
}

testQuery()
