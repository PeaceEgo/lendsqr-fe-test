import type { Guarantor, User } from '../../types/user.types'

interface DetailField {
  label: string
  value: string
}

function DetailSection({
  title,
  fields,
  columns = 5,
}: {
  title: string
  fields: DetailField[]
  columns?: 3 | 4 | 5
}) {
  return (
    <section className="user-details__section">
      <h2 className="user-details__section-title">{title}</h2>
      <div
        className={`user-details__fields user-details__fields--cols-${columns}`}
      >
        {fields.map((field) => (
          <div key={field.label} className="user-details__field">
            <p className="user-details__label">{field.label}</p>
            <p className="user-details__value">{field.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function GuarantorSection({ guarantors }: { guarantors: [Guarantor, Guarantor] }) {
  const guarantorFields = (guarantor: Guarantor): DetailField[] => [
    { label: 'Full Name', value: guarantor.full_name },
    { label: 'Phone Number', value: guarantor.phone_number },
    { label: 'Email Address', value: guarantor.email_address },
    { label: 'Relationship', value: guarantor.relationship },
  ]

  return (
    <section className="user-details__section">
      <h2 className="user-details__section-title">Guarantor</h2>
      {guarantors.map((guarantor, index) => (
        <div
          key={`guarantor-${index}`}
          className={`user-details__fields user-details__fields--cols-4 ${
            index > 0 ? 'user-details__fields--guarantor-row' : ''
          }`}
        >
          {guarantorFields(guarantor).map((field) => (
            <div key={`${index}-${field.label}`} className="user-details__field">
              <p className="user-details__label">{field.label}</p>
              <p className="user-details__value">{field.value}</p>
            </div>
          ))}
        </div>
      ))}
    </section>
  )
}

export function GeneralDetailsContent({ user }: { user: User }) {
  return (
    <div className="user-details__sections">
      <DetailSection
        title="Personal Information"
        columns={5}
        fields={[
          { label: 'Full Name', value: user.full_name },
          { label: 'Phone Number', value: user.phone_number },
          { label: 'Email Address', value: user.email },
          { label: 'BVN', value: user.bvn },
          { label: 'Gender', value: user.gender },
          { label: 'Marital Status', value: user.marital_status },
          { label: 'Children', value: user.children },
          { label: 'Type of Residence', value: user.type_of_residence },
        ]}
      />
      <DetailSection
        title="Education and Employment"
        columns={4}
        fields={[
          { label: 'Level of Education', value: user.level_of_education },
          { label: 'Employment Status', value: user.employment_status },
          { label: 'Sector of Employment', value: user.sector_of_employment },
          {
            label: 'Duration of Employment',
            value: user.duration_of_employment,
          },
          { label: 'Office Email', value: user.office_email },
          { label: 'Monthly Income', value: user.monthly_income },
          { label: 'Loan Repayment', value: user.loan_repayment },
        ]}
      />
      <DetailSection
        title="Socials"
        columns={3}
        fields={[
          { label: 'Twitter', value: user.socials.twitter },
          { label: 'Facebook', value: user.socials.facebook },
          { label: 'Instagram', value: user.socials.instagram },
        ]}
      />
      <GuarantorSection guarantors={user.guarantors} />
    </div>
  )
}
